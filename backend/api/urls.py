from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .import views
from .views import MyTokenObtainPairView, ChangePasswordView, editProfile, verify_email,get_profile


urlpatterns = [
    path('blogs/', views.getBlogs, name="blogs"),
    path('blogs/<int:pk>/', views.getBlog, name="blog"),
    path('blogs/<int:pk>/update/', views.updateBlog, name="update-blog"),
    path('blogs/<int:pk>/delete/', views.deleteBlog, name="delete-blog"),
    path('blogs/myblogs/', views.getMyBlogs, name="myblogs"),
    path('blogs/create/', views.createBlog, name="create-blog"),
    path('blogs/<int:pk>/comments/', views.getComments, name="comments"),
    
    # Like Comments
    path('comments/create/', views.createComment, name="create-comment"),
    path('comments/<int:pk>/delete/', views.deleteComment, name="delete-comment"),
    path('blogs/<int:pk>/addlike/', views.addLike, name="add-like"),
    path('blogs/<int:pk>/removelike/', views.removeLike, name="remove-like"),

    # User
    path('register/', views.registerUser, name="register"),
     path('verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
    path('profile/<int:pk>/', views.getProfile, name="getProfile"),
    path('edit-profile/', editProfile, name='edit-profile'),
     path("api/profile/", get_profile, name="get-profile"),
    # Authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.loginUser, name='login'),  # Added login path

    path('verify-email/<str:token>/', views.verify_email, name='verify_email'),
    path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    

    # Blog Categories
    path('blogs/category/', views.getCategory, name="category"),
  
 
]
