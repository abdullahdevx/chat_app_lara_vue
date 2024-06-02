<template>
<!-- 
<br>
  <h1>My Account</h1>
  <br>
  <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class=" my-3 pt-2 pb-2 ">
              <div>
                
               <h5>PROFILE PICTURE</h5>
                <img :src="picture" alt="IMAGE" id="img" class="rounded-circle ms-60" ><br><br>
                <input type="file" @change="handleFileUpload" />
  <br>
                <button class="btn btn-success" v-on:click="changePicture()">CHANGE</button>
  
              </div>
            </div>
          </div>
  <div class="col-md-6">
            <div class=" my-3 pt-2 pb-2 ">
              <div class=" ps-5 ">
             <h5>ACCOUNT DETAILS </h5>
            <div class=" ps-6 text-start"> 
             <b>
                Name: {{name}} <br>
                Email: {{email}}
              </b>
              </div>  
              </div>
            </div>
          </div>
  
        </div>
      </div> -->
      <div class="flex flex-row justify-between">
  <div class="w-1/2 p-4">
    <h1 class="text-2xl font-bold mb-4 mr-8 mt-20">Profile Picture</h1>
    <img :src="picture" alt="IMAGE" class="rounded-full ms-80 w-60 h-60 mb-4">
    <input type="file" @change="handleFileUpload" class="mb-4"><br>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold mr-10 py-2 px-3 rounded" v-on:click="changePicture()">CHANGE</button>
  </div>
  <div class="w-1/2 p-4 mr-20">
    <h1 class="text-2xl mt-20 font-bold mb-4">Account Details</h1>
    <p class="text-lg">
      <b>Name:</b> {{name}} <br>
      <b>Email:</b> {{email}}
    </p>
  </div>
</div>
  </template>
<script>
import axios from 'axios'
export default{
    name: 'UserAccount',

    data()
    {
        return{
            name: '', 
            email: '',
            picture: '',    
            newImage: null,
        }

    },
  methods:{
    handleFileUpload(event)
      {
        this.newImage = event.target.files[0];
      },
      
  async changePicture()
  {
    if(this.newImage == null)
    {
      alert('no image');
    }
    else
    {
      let userToken = localStorage.getItem('user-token');
      userToken = userToken.replace(/^"(.*)"$/, '$1');
      let formData = new FormData();
      formData.append('image', this.newImage);
     await axios.post("http://127.0.0.1:8000/api/changepicture",formData, 
     {
        headers:{
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data'
        }
     }); 
      this.newImage = '';
     this.refreshApiCall();
    }
  },

 async refreshApiCall()
      {
    let userToken = localStorage.getItem('user-token');
        userToken = userToken.replace(/^"(.*)"$/, '$1');
         const result = await axios.get("http://127.0.0.1:8000/api/accountdata", {
          headers:{
            'Authorization': `Bearer ${userToken}`
          }
        }); 
        this.name = result.data.name;
        this.email = result.data.email;
        this.picture = result.data.image;
      }
  },

     async mounted()
      {
        let userToken = localStorage.getItem('user-token');
        if(!userToken)
        {
          this.$router.push({name:'Home'});
        }
        else
       {
        userToken = userToken.replace(/^"(.*)"$/, '$1');
      const result = await axios.get("http://127.0.0.1:8000/api/accountdata", {
          headers:{
            'Authorization': `Bearer ${userToken}`
          }
        }); 
        this.name = result.data.name;
        this.email = result.data.email;
        this.picture = result.data.image;
      }
   },
}
</script>

<style scoped>
#img{

width: 190px; 
height: 200px;

}



</style>