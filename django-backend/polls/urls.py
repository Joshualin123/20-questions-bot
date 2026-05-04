from django.urls import path
from . import views

#django api section

urlpatterns = [
    path("", views.index, name="index"),
    path("get-resp/", views.get_resp, name="get_resp"),
    path("send-msg/", views.send_msg, name="send_msg"),
    path("authenticate-user/", views.authenticate_user, name="authenticate_user"),
    path("create-user/", views.create_user, name="create_user"),
    path("save-user-chat/", views.save_user_chat, name="save_user"),
    path("get-chat-history/", views.get_chat_history, name="get_chat_history"),
]   #defining api urls

