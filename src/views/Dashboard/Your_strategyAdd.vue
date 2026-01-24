<template>
      <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm " >
        <div class= "bg-white w-3/5 max-h-[90vh] rounded-lg shadow-lg relative 
         flex flex-col overflow-y-auto scrollable-containe">
         <div class="bg-blue-900 text-white flex justify-between items-center 
      px-6 py-3 rounded-t-md ">
        <h2 class="text-lg font-semibold">
          {{ mode !== 'edit' ? 'Add project' : 'Edit project' }}
        </h2>
        <button @click="router.back()" 
        class="text-white text-2xl font-bold hover:text-red-500">
        &times;</button>
      </div>
      <div class="p-6 grid grid-cols-3 gap-4">
        <div class="formGrp ">
          <label class="block mb-1">Name</label>
          <input type="text" class="w-full border border-gray-400 p-2 rounded" 
           name="pame"
          placeholder="Enter Project Name"
            id="pname" />
          <!-- <div v-if="e" class="text-red-500 text-sm"> -->


        <!-- </div> -->
        </div>
      </div>
        <!-- Form Fields -->

      </div>
      </div>

</template>
<script setup>
import { ref, reactive } from 'vue';  
import { useRouter } from 'vue-router';
const router = useRouter();
const mode = ref('add'); // 'add' or 'edit' 
</script>