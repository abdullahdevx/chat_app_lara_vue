<template>
  <br>
  <div class="register flex flex-col items-center">
    <h1 class="text-4xl font-bold mb-4">LOGIN</h1>
    <input class="mb-4 p-2 w-80 border border-gray-400 rounded " type="text" v-model="email" placeholder="Enter Name"/>
    <input class="mb-4 p-2  w-80 border border-gray-400 rounded" type="password" v-model="password" placeholder="Enter Email"/>
    <button class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded" @click="login()">LOGIN</button>
  </div>
</template>
        
    <script>
import axios from 'axios'
import { useMyStore } from '@/store/navbar.js'
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

        export default {
          name: 'LoginComponent',
          data()
          {
            return {
                email: '',
                password: '',
            }

          },
          methods:{
            incorrectCredsToast()
            {
              toast.error('Incorrect email or password',{
                autoClose:2000,
              });

            },

             async login()
       
          {
            try{
            let result = await axios.post("http://127.0.0.1:8000/api/login", {
              email: this.email,
              password: this.password,
            });

            if(result.status == 200)
            {
            const userStore = useMyStore();
           localStorage.setItem("user-token", JSON.stringify(result.data.token));
           userStore.setUserInfo();
           this.$router.push({name:'Main'});
            }
            }
            catch(error){

              if (error.response.status == 401) {
                this.incorrectCredsToast();
               }
              
            }
          
          }
        

          },
            mounted()
          {
            let user = localStorage.getItem('user-token');
            if(user)
            {
              this.$router.push({name:'Main'});
            }
          }
     }


        </script>
        
        <!-- Add "scoped" attribute to limit CSS to this component only -->
        <style scoped>

        </style>
        