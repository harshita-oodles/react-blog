#views 
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, generics, permissions
from .models import Blog, Comment, Profile, PasswordResetRequest, EmailVerification
from .serializers import *
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from .serializers import LoginSerializer, ChangePasswordSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.exceptions import ValidationError,NotFound, PermissionDenied
from django.utils import timezone
from datetime import timedelta
import uuid
from rest_framework.decorators import api_view

from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str, smart_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.models import Profile  # Change if your model is in another app
from api.serializers import ProfileSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
import json
from django.utils.encoding import force_bytes


@api_view(['POST'])
def loginUser(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        return Response({"message": "Login successful", "username": user.username})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if not user.is_active:
            raise AuthenticationFailed("Your email is not verified. Please check your inbox.")

        token = super().get_token(user)
        token['username'] = user.username
        
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def loginUser(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        return Response({"message": "Login successful", "username": user.username})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def getBlogs(request):
    category = request.GET.get('category', None)
    if category is not None:
        blogs = Blog.objects.filter(category=category)
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)
    else:
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)


@api_view(['GET'])

@permission_classes([AllowAny])
def getBlog(request, pk):
    blog = Blog.objects.get(pk=pk)
    blogSerializer = BlogSerializer(blog, many=False)
    return Response(blogSerializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyBlogs(request):
    user = request.user
    blogs = Blog.objects.filter(author=user)
    serializer = BlogSerializer(blogs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBlog(request):
    data = request.data
    user = Profile.objects.get(id=data['author'])
    serializer = BlogSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateBlog(request, pk):
    data = request.data
    blog = Blog.objects.get(pk=pk)
    serializer = BlogSerializer(instance=blog, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBlog(request, pk):
    blog = Blog.objects.get(pk=pk)
    blog.delete()
    return Response('Item successfully deleted!', status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def getComments(request, pk):
    comments = Comment.objects.filter(blog=pk)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def createComment(request):
    data = request.data
    blog = Blog.objects.get(id=data['blog'])
    serializer = CommentCreateSerializer(data=data)
    if serializer.is_valid():
        serializer.save(blog=blog)
        comment = Comment.objects.latest('id')
        commentSerializer = CommentSerializer(comment, many=False)
        return Response(commentSerializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteComment(request, pk):
    comment = Comment.objects.get(pk=pk)
    comment.delete()
    return Response('Item successfully deleted!', status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    try:
        user = Profile.objects.create_user(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['username'],
            email=data['email'],
            password=data['password'],
            photo=data['photo'],
            bio=data['bio'],
            is_active=False  # User should be inactive until email is verified
        )

        # Generate email verification token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        current_site = get_current_site(request)
        
        # Generate the full verification URL for backend
        verification_url = f"http://{current_site.domain}{reverse('verify-email', kwargs={'uidb64': uid, 'token': token})}"

        # Frontend URL for easy access to email verification page (with both uid and token as query params)
        frontend_verification_url = f"http://localhost:3000/emailverify"

        # Send email
        subject = 'Verify Your Email'
        message = f'''Hi {user.first_name},

Click the link below to verify your email:
{frontend_verification_url}

Alternatively, you can use the following verification details (in case you need to manually input them):

{uid}/{token}

Thank you!'''

        # Send the email to the user
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        # Serialize the user data and send response
        serializer = ProfileSerializer(user, many=False)
        return Response({'message': 'A verification email has been sent to your email address. Please verify your account.', 'user': serializer.data}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def resendVerification(request):
    data = request.data
    username = data.get('username')
    
    try:
        user = Profile.objects.get(username=username, is_active=False)  # Only inactive users
    except Profile.DoesNotExist:
        return Response({"error": "User not found or already verified."}, status=400)

    # Generate email verification token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    
    # Generate the full verification URL for backend
    verification_url = f"http://{current_site.domain}{reverse('verify-email', kwargs={'uidb64': uid, 'token': token})}"

    # Frontend URL for easy access to email verification page (with both uid and token as query params)
    frontend_verification_url = f"http://localhost:3000/emailverify"

    # Send email
    subject = 'Verify Your Email'
    message = f'''Hi {user.first_name},

Click the link below to verify your email:
{frontend_verification_url}

Alternatively, you can use the following verification details (in case you need to manually input them):

{uid}/{token}

Thank you!'''

    try:
        # Send the email to the user
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        # Serialize the user data and send response
        return Response({'message': 'Verification email resent. Please check your inbox.'}, status=200)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=400)
class UpdateUserDataView(generics.UpdateAPIView):
    queryset = Profile.objects.all()  
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user, data=request.data)  # Update the profile, not the user directly
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User data updated successfully!", "data": serializer.data})
        return Response(serializer.errors, status=400)

    


@api_view(['GET'])
def getCategory(request):
    return JsonResponse([category[1] for category in Blog.CHOICES], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addLike(request, pk):
    blog = Blog.objects.get(pk=pk)
    blog.likes.add(request.data['user'])
    blog.save()
    serializer = BlogSerializer(blog, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def removeLike(request, pk):
    blog = Blog.objects.get(pk=pk)
    blog.likes.remove(request.data['user'])
    blog.save()
    serializer = BlogSerializer(blog, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request, pk):
    user = get_object_or_404(Profile, pk=pk)
    serializer = ProfileSerializer(user, many=False)
    return Response(serializer.data)

# Request Password Reset (Generate OTP)
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    data = request.data
    try:
        user = Profile.objects.get(email=data['email'])

        # Generate OTP (6 digits)
        otp = str(random.randint(100000, 999999))
        reset_request = PasswordResetRequest.objects.create(user=user, otp=otp)

        # Send OTP via email
        send_mail(
            'Password Reset OTP',
            f'Use the following OTP to reset your password: {otp}',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)

    except Profile.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    data = request.data
    otp = data.get('otp')  # Use get() to avoid KeyError
    new_password = data.get('new_password')

    if not otp or not new_password:
        return Response({'message': 'OTP and new password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        reset_request = PasswordResetRequest.objects.get(otp=otp)

        # Check if OTP is expired
        if reset_request.is_expired():
            return Response({'message': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Reset user password
        user = reset_request.user
        user.set_password(new_password)
        user.save()

        # Delete OTP record after successful reset
        reset_request.delete()

        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)

    except PasswordResetRequest.DoesNotExist:
        return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Profile.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Your email has been verified. You can now log in.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid or expired verification link.'}, status=status.HTTP_400_BAD_REQUEST)

    except (TypeError, ValueError, OverflowError, Profile.DoesNotExist):
        return Response({'detail': 'Invalid verification request.'}, status=status.HTTP_400_BAD_REQUEST)    

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Request Headers:", request.headers)  # Debugging
        print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")

        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not request.user.check_password(old_password):  
                return Response({"old_password": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            request.user.set_password(new_password)
            request.user.save()

            return Response({"message": "Password changed successfully!"}, status=status.HTTP_200_OK)  # ✅ Ensure 200 OK

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([AllowAny])
def get_profile(request):
    """Return the authenticated user's profile data."""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)