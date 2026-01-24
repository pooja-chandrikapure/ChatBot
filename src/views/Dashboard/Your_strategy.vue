<template>
  <div class="pt-14 md:pt-0 w-full sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold bg-[#111827] text-white p-2 rounded-md">Strategy Page</h1>
        <div class="bg-white rounded-lg shadow p-4 md:p-6 mt-4 min-w-[700px]">
            <p class="text-gray-700 mb-4" >
                This is your Strategy page content.
            </p>
            <!-- add strategy Button -->
             <span class="flex justify-end mb-4">
             <!-- <router-link to ="/your_strategy_add"> -->
                <button 
                   
                    class="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors
                    "
                    @click="addStrategy"
                >
                    Add Strategy
                </button>
                
                <!-- </router-link> -->
          
            </span>
            <div class="overflow-x-auto ">
                <div class="min-w-[100px]">
                <ag-grid-vue
                    class="ag-theme-alpine customize-table min-w-[700px]"
                    style="height: 400px; width: 100%;"
                    :rowData="rowData"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :pagination="true"
                    :paginationPageSize="10"
                />
                </div>
            </div>
            <Add_yourStrategy
                :isOpen="showOtpModal"
                :mode="mode"
                :strategyData="selectedStrategy"
                :overflow="false"
                @close="closePlaceOrderModal()"
                @submit="handleSubmit"
                />
        </div>
  <!-- DELETE CONFIRM MODAL -->
<div
  v-if="showDeleteModal"
  class="fixed inset-0 z-[60] flex items-center justify-center 
  overflow-y-auto bg-opacity-60 
  backdrop-blur-[2px]"
>
  <div class="bg-white rounded-lg w-[400px] p-6 text-center">
    <div class="flex justify-center mb-4">
      <div class="w-12 h-12 flex items-center justify-center rounded-full border-4 border-orange-300 text-orange-400 text-2xl">
        !
      </div>
    </div>

    <h2 class="text-xl font-semibold mb-2">Are you sure?</h2>
    <p class="text-gray-600 mb-6">
      You won't be able to revert this!
    </p>

    <div class="flex justify-center gap-4">
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        @click="cancelDelete"
      >
        No, cancel!
      </button>

      <button
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        @click="confirmDelete"
      >
        Yes, delete it!
      </button>
    </div>
  </div>
</div>
</div>
</template>
<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import { onMounted, ref, watch } from 'vue'
import { getYourStrategy } from '../../stores/your_strategy';
import Add_yourStrategy from '../../components/Popup/Add_yourStrategy.vue';
import Your_strategyAdd from './Your_strategyAdd.vue';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
const yourStrategy = getYourStrategy();
const rowData = ref([]);
const showOtpModal = ref(false)
// const showDeleteModal = ref(false);
// const deleteTarget = ref(null);
const mode = ref('add'); //add|edit
const selectedStrategy = ref(null);
const isMobile = window.innerWidth < 768;
const addStrategy = () => {
    mode.value = 'add';
    selectedStrategy.value = null;
    showOtpModal.value = true;
    // router.push({ name: 'Your_strategyAdd' });
};
const closePlaceOrderModal = () => {
  showOtpModal.value = false
  // placeOrderData.value = formData
};



const editStrategy = (row) => {
    mode.value = 'edit';
    selectedStrategy.value = { ...row};
    showOtpModal.value = true;
};


const handleSubmit = async (formData) => {
    try {
        if(mode.value === "add") {
            await yourStrategy.createStrategy(formData);
        } else {
            await yourStrategy.updateStrategy(selectedStrategy.value.id, formData);
        }

        showOtpModal.value = false;
        await fetchStrategyData();
    } catch (err) {
        console.error("Save failed", err);
    }

};
// ================= DELETE MODAL LOGIC =================

const showDeleteModal = ref(false);
const deleteTarget = ref(null);

const openDeleteModal = (row) => {
  deleteTarget.value = row;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const confirmDelete = async () => {
  try {
    await yourStrategy.deleteStrategyStoreApi(deleteTarget.value.id);

    // remove row from grid
    rowData.value = rowData.value.filter(
      (item) => item.id !== deleteTarget.value.id
    );

    cancelDelete();
  } catch (err) {
    console.error('Delete failed', err);
  }
};



const columnDefs = ref([
    {
        headerName: 'ID', field: 'id', maxwidth: 80,  
        sortable: true, filter: true,
        suppressMenu: true, suppressMovable: true,
    },
    { 
        headerName: 'Name', field: 'name', maxwidth: 180,
        sortable: true, filter: true,
        suppressMenu: true, suppressMovable: true, 
   },
    { 
        headerName: 'Description', field: 'description', 
        sortable: true, filter: true,
        suppressMenu: true, suppressMovable: true, 
    },
    // { headerName: 'Public', field: 'public', 
    //     sortable: true, filter: true,
    //     suppressMenu: true, suppressMovable: true, 
    // },
    
    { 
        headerName: 'Capital Required', field: 'capital_required', 
        sortable: true, filter: true,
        suppressMenu: true, suppressMovable: true, 
    },
    {
  headerName: 'Status',
  field: 'status',
  suppressMenu: true,
  suppressMovable: true,
  cellRenderer: (params) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center';

    const toggle = document.createElement('div');
    toggle.className = `
      w-11 h-6 rounded-full cursor-pointer transition-colors relative
      ${Number(params.value) === 1 ? 'bg-blue-600' : 'bg-gray-300'}
    `;

    const knob = document.createElement('div');
    knob.className = `
      absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all
      ${Number(params.value) === 1 ? 'left-[22px]' : 'left-[2px]'}
    `;

    toggle.appendChild(knob);

    toggle.onclick = async () => {
      const newValue = Number(params.value) === 1 ? 0 : 1;

      // optimistic UI
      params.node.setDataValue('status', newValue);

      try {
        await yourStrategy.toggleStatus(params.data.id, newValue);
      } catch (err) {
        // rollback
        params.node.setDataValue('status', params.value);
      }
    };

    wrapper.appendChild(toggle);
    return wrapper;
  }
},
    { 
        headerName: 'Published', field: 'published', 
        // sortable: false, filter: false,
        suppressMenu: true, suppressMovable: true, 
        cellStyle: { padding: '1' },
        cellRenderer: (params) => {
            // if (!params.data) return '';
          const button = document.createElement('button')
          // const status = Number(params.data.status);
          const isPublished = Number(params.data.published);
          // const isBlue = status === 1 && published === 1;
          button.innerText = isPublished ? 'Published' : 'Unpublish'

          button.className = `
            px-3 py-1 text-sm rounded
            ${
            isPublished
              ? 'bg-blue-600 text-white cursor-default' 
              : 'bg-gray-400 text-black hover:bg-gray-500'}
          `

          button.disabled = isPublished;
          button.onclick = () => {
            if (isPublished) return;

            //optimistic update
            params.node.setDataValue('published', 1);

            try {
              const res = yourStrategy.togglePublish(params.data.id, 1);
              params.node.setDataValue('published', res.dta.published_at);
              params.node.setDataValue('status', res.data.status); 

            } catch (err) {
              params.node.setDataValue('published', 0);
            }
          };
          return button;

          // button.addEventListener('click', async () => {
          //     if(isBlue) return;

              // try {
              //     const res = await yourStrategy.togglePublish(
              //         params.data.id,
              //         1
              //     );

              //     //force Grid update
              //     params.node.setData({
              //         ...params.data,
              //         published: res.published,
              //         status: res.status,
              //     });
              // } catch (err) {
              //     console.error('publish failed', err)
              // }
              // });
             
        },
},
    { 
        headerName: 'Actions', field: 'Actions', 
        sortable: false, filter: false , minWidth: 150,
        suppressMenu: true, suppressMovable: true,
        cellRenderer: (params) => {
      const container = document.createElement('div')
      container.className = 'flex gap-2'

      const editBtn = document.createElement('button')
      editBtn.innerText = 'Edit'
      editBtn.className =
        'px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
      editBtn.onclick = () => {
        editStrategy(params.data);
        // alert(`Edit: ${params.data.Name}`)
      }

      const deleteBtn = document.createElement('button')
      deleteBtn.innerText = 'Delete'
      deleteBtn.className =
        'px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700'

      deleteBtn.onclick = async() => {
        openDeleteModal(params.data);
      };

      container.appendChild(editBtn)
      container.appendChild(deleteBtn)

      return container
    },
    width: 150,
    }
])

onMounted(() => {
    fetchStrategyData();
});
async function fetchStrategyData() {
    try {
        const res = await yourStrategy.fetchStrategies();
        console.log('Fetched strategy data:', res);
        rowData.value = res;
        console.log('Row data set to:', rowData.value);
    } catch (error) {
        console.error('Error fetching strategy data:', error);
    }

}

// const rowData = ref([
//     { Nsame: 'Strategy A', Descriotion: 'Description for Strategy A', Public: 'Yes', 'owner Name': 'Alice', 'Capital required': '$1000', Publish: '2023-01-01', Actions: 'Edit/Delete' },
//     { Name: 'Strategy B', Descriotion: 'Description for Strategy B', Public: 'No', 'owner Name': 'Bob', 'Capital required': '$2000', Publish: '2023-02-01', Actions: 'Edit/Delete' }
// ])

const defaultColDef = {
  sortable: true,
  // filter: false,
  resizable: false,
  minWidth: 120,
  wrapText: true,

};
</script>

<style scoped> 
.ag-theme-alpine {
    --ag-header-background-color: #1e144b; 
    --ag-header-foreground-color: #ffffff; 
    --ag-header-height: 50px; 
    --ag-header-cell-hover-background-color: #3b2f6b; 
    --ag-odd-row-background-color: #f9f9f9; 
    --ag-row-hover-color: #eee; 
    --ag-font-size: 15px; 
    color: white !important; 
    }
@media (max-width: 768px) {
  .ag-theme-alpine {
    --ag-font-size: 13px;
    --ag-header-height: 42px;
  }
}
/* .ag-theme-alpine {
    --ag-header-background-color: #1e144b; 
    --ag-header-foreground-color: #ffffff; 
    --ag-header-height: 50px; 
    --ag-header-cell-hover-background-color: #ffffff; 
    --ag-odd-row-background-color: #ffffff; 
    --ag-row-hover-color: #eee; 
    --ag-font-size: 15px; color: white !important; 
    }  */
</style>
