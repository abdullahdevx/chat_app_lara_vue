<template>
 <div>
    <div class="px-12">
      <div class="min-w-full border rounded lg:grid lg:grid-cols-3 " >
          <div class="border-r border-gray-300 lg:col-span-1">
            <div class="mx-6 my-13">
              <div class="relative text-gray-600">
               
                
                  
                <input v-model="search" type="search" class="block border-solid w-full mt-2 py-2 pl-10 bg-gray-200 rounded-full outline-none" name="search"
                  placeholder="Search Users"/>
                  
            
                <div v-if="search && users" class="dropdown-menu d-block py-1">
                  <div class="px-2 py-1 border-bottom">
                    <div v-for="data in users" :key="data.id">
                      <div class="d-flex items-center ml-3">
          
                          <img class="h-[26px]" src=""> 
                          <span class="ml-2"> {{data.name}}
                            <button v-on:click="createConversation(data.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-2 rounded-full">chat</button></span>
                          <small></small>
                      </div>
                    </div>
                  </div>
                  </div>                  

                <div v-if="search && users.length == 0" class="dropdown-menu d-block py-1">
                    <div class="px-3 py-2 border-bottom">
                        <div class="d-flex flex-column ml-3">
                            <span>No Users found!</span>
                        </div>
                    </div>
                </div>



              </div>
            </div>
         <ChatList :userId="userId" @refreshChatListToFalse="chatListToFalse" @chatSelected="handleChatSelected" :refreshChatList="refreshChatList"/>
          </div>
          <div class="hidden lg:col-span-2 lg:block">
            <div class="w-full">
              <ChatBox  :userId="userId" @refreshChatList="handleRefreshChatList" :chatId="chatId" :key="chatId"/>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
    
    <script>
import axios from 'axios';
import ChatBox from './ChatBox.vue'
import ChatList from './ChatList.vue'



    export default {
      name: 'MainComponent',
      data()
      {
        return {
          chatId: 0,
          search: '',
          users: [],
          userToken: '',
          refreshChatList: false,
          userId : 0,
         
        }
      },
      components:{
        ChatBox,
        ChatList,
      },
      watch:{
        search:function(newVal)
        {
          this.getUsers(newVal);
        }
      },

      methods:{
        chatListToFalse()
        {
          this.refreshChatList = false;
        },

        handleRefreshChatList()
        {
          this.refreshChatList = true;
          setTimeout(() => {
         this.refreshChatList = false;
          }, 2000); 

        },

        handleChatSelected(payload)
        {
          this.chatId = payload;
        },

         getUsers(query) 
         {
         
          axios.post("http://127.0.0.1:8000/api/searchuser", {
            query: query,
          },{
          headers:{
              'Authorization': `Bearer ${this.userToken}`
           }}).then(response => {
            this.users = response.data.users;
            });
        },

         async createConversation(id)
         {
         let result = await axios.post("http://127.0.0.1:8000/api/createconversation", {
            receiver_id: id,
          },
          {
      headers:{
     'Authorization': `Bearer ${this.userToken}`
      }
    });

      if(result.status == 201)
      {
        this.refreshChatList = true;
        this.search = '';
      }
         },
        },

        async mounted()
        {
          let userToken = localStorage.getItem('user-token');


          if(!userToken)
        {
          this.$router.push({name:'SignUp'});
        }
        
        else
        {
          this.userToken = userToken.replace(/^"(.*)"$/, '$1');
          let result = await axios.get("http://127.0.0.1:8000/api/getuserid",
          {
      headers:{
     'Authorization': `Bearer ${this.userToken}`
      }
    });
    if(result.status == 200)
    {
        this.userId = result.data.id;
    }
  }
        },
    }
      
    </script>
 