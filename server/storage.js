const STORAGE_KEY = 'chatlist';
export default{
  fetch:function(){
      return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||'[]');
  },
  save:function(item){
      window.sessionStorage.setItem(STORAGE_KEY,JSON.stringify(item));
  }
}