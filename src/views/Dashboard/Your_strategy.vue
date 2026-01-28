<template>
  <div class="pt-14 md:pt-0 w-full px-4 sm:px-6 lg:px-8">
    <h1 class="text-xl md:text-2xl font-semibold bg-[#111827] text-white p-2 rounded-md">
      Strategy Page
    </h1>
    
    <div class="bg-white rounded-lg shadow p-3 md:p-6 mt-4">
      <!-- Search and Add Button -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <!-- SEARCH -->
        <input
          type="text"
          placeholder="Search strategy name..."
          class="w-full md:w-64 px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          v-model="searchText"
          @input="onSearch"
        />
        <button 
          class="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm md:text-base whitespace-nowrap"
          @click="addStrategy"
        >
          Add Strategy
        </button>
      </div>
    </div>

    <!-- AG Grid Container -->
    <div class="overflow-x-auto bg-white mt-4 rounded-lg shadow  ">
      <div class="min-w-[700px] ">
        <ag-grid-vue
          class="ag-theme-alpine customize-table md:h-[150vh] h-[300px]"
          :style="gridStyle"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onGridReady"
        />
      </div>
    </div>

    <!-- Add/Edit Strategy Modal -->
    <Add_yourStrategy
      :isOpen="showOtpModal"
      :mode="mode"
      :strategyData="selectedStrategy"
      :overflow="false"
      @close="closePlaceOrderModal()"
      @submit="handleSubmit"
    />
        
    <!-- DELETE CONFIRM MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 
       bg-opacity-60 backdrop-blur-[2px]"
    >
      <div class="bg-white rounded-lg w-full max-w-[400px] p-4 md:p-6 text-center border-1 border-black">
        <div class="flex justify-center mb-4">
          <div class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-4 border-orange-300 text-orange-400 text-xl md:text-2xl">
            !
          </div>
        </div>

        <h2 class="text-lg md:text-xl font-semibold mb-2">Are you sure?</h2>
        <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          You won't be able to revert this!
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <button
            class="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
            @click="cancelDelete"
          >
            No, cancel!
          </button>

          <button
            class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm md:text-base"
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
import { onMounted, ref, computed } from 'vue'
import { getYourStrategy } from '../../stores/your_strategy';
import Add_yourStrategy from '../../components/Popup/Add_yourStrategy.vue';
import Your_strategyAdd from './Your_strategyAdd.vue';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]);

const yourStrategy = getYourStrategy();
const rowData = ref([]);
const showOtpModal = ref(false)
const mode = ref('add'); //add|edit
const selectedStrategy = ref(null);
const searchText = ref('');
const gridApi = ref(null);

const isMobile = window.innerWidth < 768;

// Computed grid style for responsive height
const gridStyle = computed(() => ({
  height: isMobile ? '350px' : '400px',
  width: '100%'
}));

const addStrategy = () => {
    mode.value = 'add';
    selectedStrategy.value = null;
    showOtpModal.value = true;
};

const closePlaceOrderModal = () => {
  showOtpModal.value = false
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
        headerName: 'ID', 
        field: 'id', 
        maxWidth: 80,  
        sortable: true, 
        filter: true,
        suppressMenu: true, 
        suppressMovable: true,
    },
    { 
        headerName: 'Name', 
        field: 'name', 
        maxWidth: 180,
        sortable: true, 
        filter: true,
        suppressMenu: true, 
        suppressMovable: true, 
    },
    { 
        headerName: 'Description', 
        field: 'description', 
        sortable: true, 
        filter: true,
        suppressMenu: true, 
        suppressMovable: true, 
    },
    { 
        headerName: 'Capital Required', 
        field: 'capital_required', 
        sortable: true, 
        filter: true,
        suppressMenu: true, 
        suppressMovable: true, 
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
          ${Number(params.data.status) === 1 ? 'left-[22px]' : 'left-[2px]'}
        `;

        toggle.appendChild(knob);

        toggle.onclick = async () => {
          const oldValue = Number(params.data.status);
          const newValue = oldValue === 1 ? 0 : 1;

          // optimistic UI
          params.node.setDataValue('status', newValue);

          try {
            await yourStrategy.toggleSatuts(params.data.id, newValue);
          } catch (err) {
            console.error('status toggle failed', err);
            // rollback
            params.node.setDataValue('status', oldValue);
          }
        };

        wrapper.appendChild(toggle);
        return wrapper;
      }
    },
    { 
        headerName: 'Published', 
        field: 'published', 
        suppressMenu: true, 
        suppressMovable: true, 
        cellStyle: { padding: '1' },
        cellRenderer: (params) => {
          const button = document.createElement('button')
          const setButtonState = (value) => {
            button.textContent = value === 1 ? 'Published' : 'Unpublished';
            button.className = `
            px-3 py-1 text-sm rounded
            ${value === 1
              ? 'bg-blue-600 text-white cursor-default' 
              : 'bg-gray-400 text-black hover:bg-gray-500'}`;
          };

          // initial state
          setButtonState(params.data.published);

          button.onclick = async () => {
            const oldValue = Number(params.data.published);
            const newValue = oldValue === 1 ? 0 : 1;

            // optimistic UI
            params.node.setDataValue('published', newValue);
            setButtonState(newValue);

            try {
              await yourStrategy.togglePublish(params.data.id, newValue);
            } catch (err) {
              console.error('Publish toggle failed', err);
              // rollback
              params.node.setDataValue('published', oldValue);
              setButtonState(oldValue);
            }
          };
          return button;
        }
    },
    { 
        headerName: 'Actions', 
        field: 'Actions', 
        sortable: false, 
        filter: false, 
        minWidth: 150,
        suppressMenu: true, 
        suppressMovable: true,
        cellRenderer: (params) => {
          const container = document.createElement('div')
          container.className = 'flex gap-2'

          const editBtn = document.createElement('button')
          editBtn.innerText = 'Edit'
          editBtn.className =
            'px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
          editBtn.onclick = () => {
            editStrategy(params.data);
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

const onGridReady = (params) => {
  gridApi.value = params.api;
}

const onSearch = () => {
  if(!gridApi.value) return;
  gridApi.value.setQuickFilter(searchText.value);
}

const defaultColDef = {
  sortable: true,
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

/* Improve mobile scrolling */
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>