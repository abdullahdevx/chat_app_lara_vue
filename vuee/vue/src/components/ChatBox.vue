<template>         
     <div v-if="chatId == 0" class=" h-[45rem] relative w-full p-6 overflow-y-auto">             
       <ul class="space-y-2 font-medium mt-80">     
        No chats selected
      </ul>
 </div>



 <!-- SHOWING THIS DIV IF THE CHAT IS SELECTED -->
    <div  v-if="chatId > 0  && selectedConversationData.receiver_inverse_relation && selectedConversationData.sender_inverse_relation">
 <div class="relative flex items-center p-3 border-b border-gray-300 ">
  <div v-if="userId === selectedConversationData.receiver_inverse_relation.id" class="flex items-center">         
        <img   class="h-[48px] ms-1 object-cover w-12 rounded-full" :src="selectedConversationData.sender_inverse_relation.image"> 
        <span  class="block ml-2 font-bold text-gray-600">{{ selectedConversationData.sender_inverse_relation.name}}</span>
  </div >
  <div class="flex items-center" v-else>
  <img   class="h-[48px] object-cover w-12 ms-1 rounded-full" :src="selectedConversationData.receiver_inverse_relation.image">          
            <span  class="block ml-2 font-bold text-gray-600">{{ selectedConversationData.receiver_inverse_relation.name}}</span>
  </div>
          </div>   
        </div>          
      <div v-if="chatId > 0" ref="chatContainer" class=" h-[45rem] relative w-full p-6 overflow-auto">             
        <ul v-for="messages in chatData" :key="messages.id"  class="space-y-2">            
              <li class="flex justify-end ">
            <div v-if="messages.sender_id == userId" class=" flex px-2 py-1.5   rounded shadow bg-blue-300 break-all">
              <span>{{messages.body}}</span> 
            </div>
              </li>
            
             <li class="flex justify-start"> 
             <div v-if="messages.sender_id != userId" class="flex px-2 py-1.5 text-gray-700 bg-gray-200 rounded shadow break-all"> 
               <span>{{messages.body}}</span> 
             </div>
             </li>
       </ul>
     


    <div class="fixed bottom-0 right-0 mr-60 mb-6 w-[800px]  p-6 flex items-center">

      <input v-model="message" @keyup.enter="sendMessage()" class="flex-1 border border-gray-500 rounded-full p-2" placeholder="Send message...">
      <button @click="sendMessage()" class="bg-gray-600 text-xl text-white rounded rounded-full px-4 py-2 ms-1 ">Send</button>
      </div>
  </div>

  
</template>
<script>
import axios from 'axios'
import Echo from 'laravel-echo';
import { useMyStore } from '@/store/navbar.js'
window.Pusher = require('pusher-js');

export default {
    name: 'ChatBox',
    data()
  {
    return {
      chatData: [],
      message: '',
      selectedConversationData : [],
      userToken: '',
    }

  },
  props:['chatId', 'userId'],
  
watch: {
  chatData() {
    this.scrollToBottom();
  }
},

  methods:{
    scrollToBottom() {
    this.$nextTick(() => {
      if (this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    });
  },
  
    async loadChat()
    {
      let userToken = localStorage.getItem('user-token');
        userToken = userToken.replace(/^"(.*)"$/, '$1');
        let result = await axios.get(`http://127.0.0.1:8000/api/showchat/${this.chatId}`, {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        });
        this.chatData = result.data.messages;

        if(result.status == 200)
        {
          this.chatData = result.data.messages;
        
        }
      
    },

   async loadSelectedConversationData()
    {
      let userToken = localStorage.getItem('user-token');
        userToken = userToken.replace(/^"(.*)"$/, '$1');
        let result = await axios.post("http://127.0.0.1:8000/api/conversationdata", {
          conversation_id : this.chatId,
        }, {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        });
        if(result.status == 200)
        {
          this.selectedConversationData = result.data.data;
          
        }
    },

    async sendMessage()
    {
      let userToken = localStorage.getItem('user-token');
        userToken = userToken.replace(/^"(.*)"$/, '$1');
        let result = await axios.post("http://127.0.0.1:8000/api/sendmessage", {
          conversation_id : this.chatId,
          body: this.message,
        }, {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        });
        if(result.status == 201)
        {
          this.message = '';
          this.$emit('refreshChatList');
        }
    },
  },

async mounted()
{ 
  const userStore = useMyStore();

  if(userStore.loginState == true)
{
  setTimeout(() => {
      this.loadChat();
    }, 100);
      if(this.chatId > 0)
        {
          this.loadSelectedConversationData();
        }
      
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'b6a4d2642213ed1fa360',
            cluster: 'ap2',
            forceTLS: true,
        });

        // Listen for channel events
        window.Echo.channel('chat').listen('MessageSent', (e) => {
            // Handle the received message (e.data) here
            if(this.chatId == e.conversation_id)
            {
            this.loadChat();
            }
        });
}
},

// async beforeUnmount() {
//     // Stop listening to the channel
//     window.Echo.leave('chat');
//   },
}
</script>