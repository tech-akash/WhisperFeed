
from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import tweet,Profile,tweetLike,Tags

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','first_name','second_name']

class createTweetSerializer(serializers.ModelSerializer):
    likes=serializers.SerializerMethodField()
    username=serializers.SerializerMethodField(source='user')
    is_reply=serializers.SerializerMethodField()
    is_retweet=serializers.SerializerMethodField()
    class Meta:
        model=tweet
        fields=['id','content','image','username','is_retweet','is_reply','likes','timeStamp']
    def get_username(self,obj):
        return obj.user.username
    def get_is_reply(self,obj):
        return obj.is_reply
    def get_is_retweet(self,obj):
        return obj.is_retweet
    def get_likes(self,obj):
        return obj.likes.count()
    
    


class tweetSerializer(serializers.ModelSerializer):
    likes=serializers.SerializerMethodField()
    is_reply=serializers.SerializerMethodField()
    is_retweet=serializers.SerializerMethodField()
    username=serializers.SerializerMethodField(source='user')
    parent=createTweetSerializer()
    class Meta:
        model=tweet
        fields=['id','content','image','likes','parent','is_retweet','is_reply','username','timeStamp']
    def get_likes(self,obj):
        return obj.likes.count()
    def get_is_reply(self,obj):
        return obj.is_reply
    def get_is_retweet(self,obj):
        return obj.is_retweet
    def get_username(self,obj):
        return obj.user.username

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    # LikedTweets=serializers.SerializerMethodField()
    # OwnTweets=serializers.SerializerMethodField()
    username=serializers.SerializerMethodField(source='user')
    class Meta:
        model=Profile
        fields=['Fname','Lname','DOB','user','username','profileImg','CountryOfOrigin']
    def get_username(self,obj):
        return obj.user.username    
    
    

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Tags
        fields='__all__'