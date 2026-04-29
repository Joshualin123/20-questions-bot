from django.urls import path
from . import views

#django api section

urlpatterns = [
    path("", views.index, name="index"),
    path("get-resp/", views.get_resp, name="get_resp"),
    path("send-msg/", views.send_msg, name="send_msg"),
]   #defining api urls

