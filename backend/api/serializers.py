#serializer
from rest_framework.serializers import ModelSerializer
from .models import Blog, Comment, Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model


class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            'id',
            'title',
            'slug',
            'date_created',
            'date_updated',
            'content',
            'image',
            'category',
            'publish_status',
            'likes',
            'total_likes',
            'summary',
            'author_name',
            'author_photo',
            'author_bio',
            'reading_time',
            'comment_count'
        ]


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id',
            'username',
            'body',
            'date_format',
            'user_photo'
        ]

class CommentCreateSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'body',
            'blog',
            'user'
        ]


class ProfileSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Profile
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'photo',
            'email',
            'password',
            'bio'
        ]

    def create(self, validated_data):
        user = User.objects.create(
            validated_data['first_name'],
            validated_data['last_name'],
            validated_data['username'],
            validated_data['email'],
            validated_data['password'],
        )
        profile = Profile.objects.create(
            user=user,
            photo=validated_data['photo'],
            bio=validated_data['bio'],
        )
        return profile


from rest_framework import serializers
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['username', 'photo']
        


    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        return {
            'user': user
        }
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords must match."})
        return data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email')
        
