<template>
    <div id="chatroom">
        <div class="header">
            <div class="roomUser">
                <p>ChatRoom({{clientNum}}users)</p>
            </div>
        </div>
        <div class="body">
            <div v-for="(item,index) in msgs" :key="index">
                <div v-if="item.msgType=='online'" class="onlineMsg">
                    <div class="sysTime">{{item.time}}</div>
                    <div class="online">{{item.username}}上线</div>
                </div>
                <div v-else-if="item.msgType=='offline'" class="offlineMsg">
                    <div class="sysTime">{{item.time}}</div>
                    <div class="online">{{item.username}}下线</div>
                </div>
                <div v-else-if="item.msgType=='clientMsg'" class="clientMsg">
                    <div class="sysTime">{{item.time}}</div>
                    <div v-if="item.username==$route.query.username" class="self">
                        <div class="bubble">
                            <div class="chatBubble">{{item.msg}}</div>
                            <div class="triangle"></div>
                        </div>
                        <div class="user">{{item.username}}</div>
                    </div>
                    <div v-else class="others">
                        <div class="user">{{item.username}}</div>
                        <div class="bubble">
                            <div class="chatBubble">{{item.msg}}</div>
                            <div class="triangle"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <div class="footer">
      <div class="msgInput">
        <input v-model="msg" autofocus class="input" type="text" @keydown.enter="send(msg)" placeholder="press Enter to send message" >
      </div>
    </div>
    </div>
</template>

<script>
var moment = require("moment")
import storage from '../../server/storage';
export default {
    name:"chatRoom",
    data(){
        return{
            socket:null,
            msg:"",
            msgs:storage.fetch(),
            clientNum:0,
            showEmoji:false,
            emoji:[]          
        }
    },
    mounted:function(){
        this.socket = io("http://localhost:8081");
        if(this.$route.query.username){
            this.socket.emit('online',this.$route.query.username);
        }else{
            alert("Login First")
            this.$router.push("/");
        }
        this.socket.on('online',data=>{
            this.msgs.push({
                msgType:"online",
                username:data,
                time:moment().format("HH:mm:ss")
            })
            storage.save(this.msgs);
        })
        this.socket.on('broadcastMsg',data=>{
            this.msgs.push({
                msgType:"clientMsg",
                username:data.username,
                msg: data.msg,
                time:moment().format("HH:mm:ss")
            })
            storage.save(this.msgs);
        })
        this.socket.on('offline',data=>{
            this.msgs.push({
                msgType:"offline",
                username:data,
                time:moment().format("HH:mm:ss")
            })
            storage.save(this.msgs);
        })
        this.socket.on("clientNum",num=>{
            this.clientNum = num
        })
    },
    updated:function(){
        this.$nextTick(function(){
            var oBody = document.querySelector(".body");
            oBody.scrollTop = oBody.scrollHeight;
        })
    },
    methods:{
        send:function(data){
            var transdata = {
                msg:data,
                username:this.$route.query.username
            };
            if(data){
                this.socket.emit("msg",transdata);
                this.msg="";
            }else{
                alert('消息为空！');
            }
        }
    }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  color: brown;
}
.chatroom {
  width: 400px;
  height: 600px;
  position: relative;
  border: 1px solid #999;
  margin: 0 auto;
  margin-top: 15px;
}
.header {
  background-color: rgb(112, 114, 175);
  height: 50px;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.body {
  height: 505px;
  width: 100%;
  overflow: auto;
  text-align: center;
}
.iconfont {
  font-size: 24px;
}
.logout,
.about {
  padding: 7px;
}
.sysTime {
  color: #999;
  font-size: 13px;
  margin-bottom: 3px;
}
.onlineMsg,
.offlineMsg,
.clientMsg{
  margin-bottom: 10px;
  height: 50px;
  width: 100%;
}
.clientMsg{
  position: relative;
}
.online,
.offline {
  display: inline-block;
  height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 3px;
  color: #999;
  text-align: center;
  line-height: 23px;
  background-color: rgb(209, 209, 209);
  font-size: 16px;
  box-sizing: border-box;
}
.self {
  position: absolute;
  right: 14px;
}
.others {
  position: absolute;
  left: 14px;
}
.bubble {
  display: inline-block;
  position: relative;
}
.chatBubble {
  height: 30px;
  line-height: 30px;
  background-color: rgb(198, 205, 243);
  font-size: 16px;
  color: rgb(58, 58, 58);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.self .triangle {
  position: absolute;
  right: -10px;
  top: 10px;
  border-left: 10px solid rgb(198, 205, 243);
  border-bottom: 10px solid transparent;
}
.others .triangle {
  position: absolute;
  left: -10px;
  top: 10px;
  border-right: 10px solid rgb(198, 205, 243);
  border-bottom: 10px solid transparent;
}
.self .user {
  display: inline-block;
  margin-left: 10px;
}
.others .user {
  display: inline-block;
  margin-right: 10px;
}
.footer {
  height: 45px;
  width: 100%;
  position: absolute;
  bottom: 0;
  display: -webkit-flex;
  display: flex;
}
.emoji {
  position: absolute;
  left: 10px;
  top: 10px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.emojiList {
display: inline;
  /* width: 400px;
  height: 145px; */
  position: absolute;
  bottom: 30px;
  border: 1px solid #ccc;
  background-color: rgb(244, 248, 250);
  box-sizing: border-box;
  padding: 0px;
}
.emojiList li {
  display: inline-block;
  margin: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
}
.emojiList li:hover {
  border: 1px solid #ccc;
}
.msgInput {
  position: relative;
  width: 100%;
  height: 45px;
}
.msgInput .input {
  box-sizing: border-box;
  width: 350px;
  height: 45px;
  border: 1px solid #eee;
  padding-left: 50px;
  background-color: #d1b8b8;
  font-size: 18px;
  caret-color: rgb(62, 141, 231);
  color: rgb(55, 125, 182);
}
</style>
