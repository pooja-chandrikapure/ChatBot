<template>
  <transition name="fade">
  <div
    v-if="isOpen"
    @click.self="close"
    :strategyData="selectedStrategy"
    class="fixed inset-0 bg-opacity-60 z-[60] 
    overflow-y-auto flex items-center justify-center
    backdrop-blur-[2px] "
  >
  <div class="p-6 ">
    <div class="bg-white p-6 rounded-lg w-[450px] border-1 border-black">
      <label class="text-lg font-semibold mb-3">Name</label>
      <input
        type="text" v-model="form.name"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter Name"
      />
        
    <!-- </div> -->
    <!-- <div class="bg-white p-6 rounded-lg w-[450px] border-1 border-black"> -->
      <label class="text-lg font-semibold mb-3">Description</label>
      <input
        type="text"
        v-model="form.description"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter Description"
      />
        
    <!-- </div> -->
    <!-- <div class="bg-white p-6 rounded-lg w-[450px] border-1 border-black"> -->
      <label class="text-lg font-semibold mb-3">Capital_required</label>
      <input
        type="text"
        v-model="form.capital_required"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter Capital_required"
      />
      <label class="text-lg font-semibold mb-3">Status</label>
      <!-- Toggle -->
      <div
        @click="toggleStatus"
        class="w-11 h-6 rounded-full cursor-pointer transition-colors relative"
        :class="form.status === 1 ? 'bg-blue-600' : 'bg-gray-300'"
      >
        <div
          class="absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all"
          :class="form.status === 1 ? 'left-[22px]' : 'left-[2px]'"
        ></div>
      </div>
      <span class="text-sm font-medium text-gray-700">
      {{ form.status === 1 ? 'Active' : 'Inactive' }}
    </span>
      <!-- <input
        type="text"
        v-model="form.status"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter Status"
      /> -->
      <!-- <label class="text-lg font-semibold mb-3">Published</label>
      <input
        type="text"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter Status"
      /> -->
      <div class="flex justify-end mt-4">
        <button
          @click="submitStrategy"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
        {{ mode === 'add' ? 'Add' : 'Save' }}
        
        </button>
    </div>
    </div>
    </div>
  </div>
  </transition>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getYourStrategy } from '../../stores/your_strategy';

const your_strategy = getYourStrategy();
const yourStrategy = getYourStrategy();
// const mode = ref('add'); //add|edit;
const selectedStrategy = ref(null);
const toggleStatus = () => {
  form.value.status = form.value.status === 1 ? 0 : 1;
}

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  isOpen: Boolean,
  mode: String, //ad | edit
  strategyData: Object,
  overflow: {
      type: Boolean,
      default: false
    }, 
    // bgModal: {
    //   type: String,
    //   default: 'bg-[#ffffff]'
    // }
})


const form = ref({
    name: '',
    description: '',
    status: '1',
    capital_required: '',
    published: 0
});

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    capital_required: 0,
    status: 1,
    published: 0,
  };
};

watch(
  () => props.strategyData,
  (val) => {
    console.log("edit data", val)
    if (val && props.mode === 'edit') {
      form.value = {
        name: val.name ?? '',
        description: val.description ?? '',
        capital_required: val.capital_required ?? '',
        status: val.status ?? 1,
        published: val.published ?? 0,
      };
    } if(props.mode === 'add') {
      resetForm();
    }
  },
  { immediate: true }
);
const submitStrategy = () => {
  emit('submit', { ...form.value });
};
const close = () => {
    emit("close");
  };
// const submitStrategy = async (formData) => {
  
//     try {
//       console.log("add",formData, submitStrategy)
//       if(mode.value = 'add') {
//         await yourStrategy.createStrategy(form.value, formData);
//       } else {
//         await yourStrategy.updateStrategy(selectedStrategy.value.id, formData)
//       }
//         //
//         emit('close')
//         //rest form
//         form.value = {
//             name: '',
//             description: '',
//             status: '1',
//             capital_required: '',
//             published: false,
//         }
//         fetchStrategiesStore();
//     } catch (error) {
//         console.error("Create Strategy Failed:", error.message)
//     }
  
// }



async function fetchStrategiesStore() {
  const res = await your_strategy.fetchStrategies();
  console.log("ddvd",res);
  
}
const localOtp = ref('')








// const close = () => {
//   emit('close');
// }



</script>
