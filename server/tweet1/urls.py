
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static  
from mytweet.views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/', MyTokenObtainPairView.as_view(), name='my_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('',home_view,name="home"),
    path('createtweet/',create_tweet,name="createtweet"),
    path('profile/<str:pk>/',profile_view,name="profile"),
    path('createuser/',signup_view,name="signup"),
    path('signin/',signin_view,name="sigin"),
    path('logout/',logout_view,name="logout"),
    path('like/<int:pk>/',tweet_like_toggle,name="likeTweet"),
    path('retweet/<int:pk>/',retweet_view,name="retweetTweet"),
    path('reply/<int:pk>/',reply_view,name="replyTweet"),
    path('detail/<int:pk>/',tweet_detail_view,name="tweetDetail"),
    path('toggleFollower/',toggle_follower,name="follower"),
    path('discover/',discover_view,name="discover"),
    path('chat/', chat_list, name='index'),
    path('chat/<str:room_name>/', chatroom, name='room'),
    path('trending/',get_trending_hashtags,name='treding'),
    path('hashtag/<str:nameoftag>/', posts_by_hashtag, name='post-by-hashtag'),
    path('follow-hashtag/<str:nameoftag>/',follow_hashtag,name="follow-hashtag"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)