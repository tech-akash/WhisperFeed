import profile
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
# from itsdangerous import Serializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .serializers import *
# Create your views here.
from .models import *
from django.contrib.auth.models import User
from .forms import createUserForm
from django.contrib.auth import login,logout,authenticate

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Max,Count
import re
from django.utils import timezone



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token    

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def signup_view(request,*args,**kwargs):
    form=createUserForm()
    if request.method=='POST':
        form=createUserForm(request.POST)
        print(form)
        if form.is_valid():
            form.save()
            username=form.cleaned_data['username']
            user=User.objects.get(username=username)
            Profile.objects.create(user=user)
    return Response(request.POST)

@api_view(['POST'])
def signin_view(request,*args, **kwargs):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
    user=authenticate(request,username=username,password=password)
    if user is not None:
        login(request,user)
    else:
        raise Http404("User does not exist")
    print(request.user)
    return Response(request.POST)   
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout_view(request,*args, **kwargs):
    logout(request)
    return Response({})

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def home_view(request,*args,**kwargs):
    # print(request.user)
    profile=Profile.objects.get(user=request.user)
    # mytweetcount=profile.following.all().annotate(tweetCount=Count('user'))
    # print(mytweetcount)
    # tweet.objects.filter(user__in=[]).count()
    # result = (Members.objects
    # .values('designation')
    # .annotate(dcount=Count('designation'))
    # .order_by()
# )
# tweet.objects.values('')
    # tweet.objects.v
    # print(following)
    following=profile.following.all()
    obj=tweet.objects.filter(tags__in=following).order_by('-timeStamp')[:100]
    # print(obj)
    # following=following.values()
    follow={}
    # tweet_obj=[]
    # print(following)
    # for x in following :
    #     follow[x.tag]=1
    #     user=User.objects.get(username=x['username'])
    #     for y in tweet.objects.filter(user=user):
    #         tweet_obj.append(y)
    
    # tweetCount=tweet_obj.annotate(tweetCount=Count('user'))
    # print(tweetCount)


    # tweet_obj=tweet.objects.all()
    serializer=tweetSerializer(obj,many=True)
    serializer1=TagsSerializer(following,many=True)
    tweets={}
    data=[]
    for x in following:
        data.append(x.tag)
    tweets['data']=serializer.data
    tweets['following']=data
    return Response(tweets)

@api_view(['POST'])
def create_tweet(request,*args,**kwargs):
    serializer=createTweetSerializer(data=request.data,many=False)
    if serializer.is_valid():
        serializer.save(user=request.user)
        obj=tweet.objects.get(id=serializer.data['id'])
        hashtags = re.findall(r'#\w+', obj.content)
        print(hashtags)
        for hashtag_string in hashtags:
            hashtag, created = Tags.objects.get_or_create(tag=hashtag_string[1:])
            obj.tags.add(hashtag)
        
        profile=Profile.objects.get(user=request.user)
        for tag in obj.tags.all():
            if not tag in profile.following.all():
                profile.following.add(tag) 

    else:
        raise Http404("User does not exist")
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def toggle_follower(request,*args, **kwargs):
    print(request.data['data1'])
    profile=Profile.objects.get(user=request.user)
    following=profile.following.all().values('username')
    obj=User.objects.get(username=request.data['data1'])
    for x in following:
        if(request.data['data1']==x['username']):
            profile.following.remove(obj)
            return Response({})
    profile.following.add(obj)
        
    return Response({})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tweet_like_toggle(request,pk,*args, **kwargs):
    obj=tweet.objects.get(id=pk)
    print(obj)
    if not obj:
        return Response({},status=404)
    if request.user in obj.likes.all():
        obj.likes.remove(request.user)
    else:
        obj.likes.add(request.user)
    
    return Response ({"message":"Tweet Liked"})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def retweet_view(request,pk,*args, **kwargs):
    obj=tweet.objects.get(id=pk)
    # print(obj)
    content=request.POST.get('content')
    if not obj:
        return Response({},status=404)
    else:
        obj1=tweet.objects.filter(parent=obj,user=request.user,is_retweet=True).first()
        print(obj1)
        if obj.is_retweet and obj.user==request.user:
            obj.delete()

            # tweet.objects.(obj1.first)
            # tweet.objects
        elif obj1 is not None:
            obj1.delete()
        else:
            tweet.objects.create(parent=obj,content=content,user=request.user,is_retweet=True)
        # obj.like.add(request.user)
    
    return Response ({"message":"Tweet Liked"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_view(request,pk,*args, **kwargs):
    obj=tweet.objects.get(id=pk)
    print(obj)
    content=request.POST.get('content')
    image=request.POST.get('image')
    print(content)
    if not obj:
        return Response({},status=404)
    else:
        tweet.objects.create(parent=obj,image=image,content=content,user=request.user,is_reply=True)

        # obj.like.add(request.user)
    
    return Response ({"message":"Tweet Replied"})

@api_view(['GET'])
def tweet_detail_view(request,pk,*args, **kwargs):

    parent=tweet.objects.get(id=pk)
    serializer=tweetSerializer(parent,many=False)
    value={}
    if parent.is_reply:
        pid=serializer.data['parent']['id']
        parent=tweet.objects.get(id=pid)
        serializer=tweetSerializer(parent,many=False)
        if parent.is_reply:
            pid=serializer.data['parent']['id']
            parent=tweet.objects.get(id=pid)
            serializer=tweetSerializer(parent,many=False)
    # print(serializer.data['parent']['id'])
    value['parent']=serializer.data
    obj=[]
    tweet_obj=tweet.objects.filter(parent=parent,is_reply=True)
    serializer=tweetSerializer(tweet_obj,many=True)
    obj1=serializer.data
    for x in obj1:
        parent=tweet.objects.get(id=x['id'])
        z=tweet.objects.filter(parent=parent,is_reply=True)
        serializer1=tweetSerializer(z,many=True)
        x['children']=serializer1.data
        print(serializer1.data)
        obj.append(x)
    value['comments']=obj
    return Response(value)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request,pk,*args,**kwargs):
    user=User.objects.get(username=pk)
    profile=Profile.objects.get(user=user)
    serializer=UserProfileSerializer(profile,many=False)
    value=serializer.data
    obj=tweetLike.objects.filter(user=user).values('tweet_id')
    likedTweet=[]
    for x in obj :
        tweet_obj=(tweet.objects.get(id=x['tweet_id']))
        likedTweet.append(tweet_obj)
    print(likedTweet)
    ownTweet_obj=tweet.objects.filter(user=user,is_reply=False,is_retweet=False)
    ownTweet=tweetSerializer(ownTweet_obj,many=True).data
    # print(ownTweet)
    value['likedTweet']=tweetSerializer(likedTweet,many=True).data
    value['ownTweet']=ownTweet
    return Response(value)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def discover_view(request,*args, **kwargs):
    hashtags=Tags.objects.all()
    user_list=User.objects.all().values()
    allUser=[]
    allTags=[]
    for x in hashtags:
        allTags.append(x.tag)
    tags={}
    tags['allTags']=allTags
    return Response(tags)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def chat_list(request,*args, **kwargs):

    pass


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def chatroom(request,room_name,*args, **kwargs):
    room=Chat_Room.objects.filter(name=room_name).first()
    chats=[]
    if room:
        chats=Chat.objects.filter(room=room)
    else:
        room=Chat_Room(name=room_name)
        room.save()
    
    return Response({
        'room_name':room_name,
        'chats':chats
    })


# def trending_hashtags(request, text_id):
#     tweets_object = tweet.objects.get(id=text_id)
#     trending_hashtags = tweets_object.get_trending_hashtags()
#     response_data = {
#         'trending_hashtags': trending_hashtags
#     }
#     return Response(response_data)
@api_view(['GET'])
def get_trending_hashtags(request, limit=10, period_hours=24):
        # Set the time period for counting hashtag occurrences
        period = timezone.now() - timezone.timedelta(hours=period_hours)
        
        # Get all text objects created in the past 24 hours
        text_objects = tweet.objects.filter(timeStamp__gte=period)
        
        # Create a dictionary to store the hashtag counts
        hashtag_counts = {}
        
        # Count the number of times each hashtag appears in the text objects
        for text_object in text_objects:
            # print(text_object.content)
            hashtags=[]
            if text_object.content is not None:
            
                hashtags = re.findall(r'#\w+', text_object.content)
            for hashtag in hashtags:
                hashtag_counts[hashtag] = hashtag_counts.get(hashtag, 0) + 1
        
        # Sort the hashtags by count
        sorted_hashtags = sorted(hashtag_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Return the top N hashtags
        print(sorted_hashtags)
        hashtags=[hashtag for hashtag, count in sorted_hashtags[:limit]]
        print(hashtags)
        res={
            'topHashtags':hashtags
        }
        return Response(res)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def posts_by_hashtag(request, nameoftag):
    print(nameoftag)
    try:
        hashtag = Tags.objects.get(tag=nameoftag)
    except Tags.DoesNotExist:
        return JsonResponse({'error': 'Hashtag not found'}, status=404)
    
    queryset = tweet.objects.filter(tags=hashtag)
    serializer=tweetSerializer(queryset,many=True)
    print(serializer.data)
    res={
        'data':serializer.data
    }
    # posts = [{'title': post.title, 'content': post.content, 'hashtags': post.hashtags} for post in queryset]
    return Response(res)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def follow_hashtag(request, nameoftag):
    # Get the hashtag object
    hashtag = get_object_or_404(Tags, tag=nameoftag)
    # Get the current user
    # user = request.user
    
    profile=Profile.objects.get(user=request.user)
    # Add the hashtag to the user's followed hashtags
    # tag=Tags.objects.get(ta)
    if hashtag in profile.following.all():
        print(nameoftag)
        profile.following.remove(hashtag)
    else:

        profile.following.add(hashtag)

    # Redirect the user to the previous page
    return Response({})



