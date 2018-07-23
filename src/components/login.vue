<template>
    <div id="container">
        <input type="text" v-model="username" @keydown.enter="login" autofocus>
    </div>
</template>

<script>
export default {
    name:"Login",
    data () {
        return {
            username:""
        }
    },
    methods:{
        login(){
            if(this.username){
                this.$router.push({path: '/chatroom', query:{username:this.username}});
            }else{
                alert("请输入您的名字")
            }
        }
    }
}
</script>

<style>

</style>
