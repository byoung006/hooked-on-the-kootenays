<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Add Fishing Spot Details</h3>
      <span v-if="invalidFields.length > 0">Please fill all fields</span>
      <div class="field-wrapper" v-for="field in fields" :key="field">
        <label class="input__label" v-if="
          field !== 'latitude' &&
          field !== 'longitude' &&
          field !== 'camping' &&
          field !== 'dogFriendly' &&
          field !== 'hikeIn' &&
          field !== 'hikeDifficultyLevel'
        " :class="{ error: invalidFields.includes(field) }">
          <p>{{ field.toString() }}:</p>
          <input class="input__field" :class="{ error: invalidFields.includes(field) }" v-model="formData[field]"
            type="text" />
        </label>
        <label class="input__label" v-else-if="field === 'camping' || field === 'hikeIn'"
          :class="{ error: invalidFields.includes(field) }">
          <p>{{ field }}:</p>
          <select class="input__field" :class="{ error: invalidFields.includes(field) }" v-model="formData[field]">
            <option value="">Select</option>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </label>

        <label class="input__label" v-else-if="field === 'dogFriendly'"
          :class="{ error: invalidFields.includes(field) }">
          <p>{{ field }}:</p>
          <select class="input__field" :class="{ error: invalidFields.includes(field) }" v-model="formData[field]">
            <option value="">Select</option>
            <option value="Dogs off leash allowed">Dogs off leash allowed</option>
            <option value="Dogs on leash">Dogs on leash</option>
            <option value="No Dogs allowed">No Dogs allowed</option>
          </select>
        </label>
        <div class="hikeDifficulty" v-else-if="field === 'hikeDifficultyLevel'">
          <p class="input__label">Hike Difficulty Level:</p>
          <div class="field" v-for="level in [1, 2, 3, 4, 5]" :key="level">
            <input class='input' type="radio" :id="`difficulty-${level}`" :value="level.toString()"
              v-model="formData[field]" />
            <label class="label" :for="`difficulty-${level}`">{{ level }}</label>
          </div>
        </div>
        <label class="input__label" v-else-if="field === 'latitude'" :class="{ error: invalidFields.includes(field) }">
          <p>Latitude:</p>
          <p class="input__field">{{ formData.latitude }}</p>
        </label>
        <label class="input__label" v-else-if="field === 'longitude'" :class="{ error: invalidFields.includes(field) }">
          <p>Longitude:</p>
          <p class="input__field">{{ formData.longitude }}</p>
        </label>
      </div>
      <div class="button-wrapper">
        <button class="button" @click="save">Save</button>
        <button class="button" @click="close">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, type PropType } from 'vue';

interface PointData {
  name: string;
  latitude: number;
  longitude: number;
  camping: string;
  trailLength?: string;
  dogFriendly?: string;
  hikeDifficultyLevel?: number;
  hikeIn?: string;
  linkToWebsite?: string | undefined;
  [key: string]: string | number | undefined;
}
type PointDataKeys = Exclude<keyof PointData, 'latitude' | 'longitude' | 'hikeDifficultyLevel' |
  'linkToWebsite'>[];
;
export default defineComponent({
  name: 'AddMapPoint',
  props: {
    fields: {
      type: Array as PropType<PointDataKeys>,
      required: true,
    },
    formData: {
      type: Object as PropType<PointData>,
      required: true,
    },
    newPoint: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const invalidFields = reactive<PointDataKeys>([]);
    props.formData.latitude = props.newPoint.latitude;
    props.formData.longitude = props.newPoint.longitude;
    console.log(props.fields)
    const validateFormData = (formData: PointData): string[] => {
      const invalid: string[] = [];
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const value = formData[key];
          if (key !== 'latitude' && key !== 'longitude' && key !== 'linkToWebsite') {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              invalid.push(key);
            }
          }
        }
      }
      return invalid;
    };

    // Initialize invalidFields
    invalidFields.splice(0, invalidFields.length, ...validateFormData(props.formData));
    console.log(invalidFields, 'init')
    // Watch for formData changes
    watch(
      () => props.formData,
      (newFormData) => {
        console.log(newFormData, 'the heck new')
        if (newFormData) { // Ensure newFormData exists
          for (const key in newFormData) {
            if (newFormData.hasOwnProperty(key) && newFormData[key]) {
              // A field has changed
              const invalid = validateFormData(newFormData);
              invalidFields.splice(0, invalidFields.length, ...invalid);
              break; //Revalidate whole form.
            }
          }
        }
      },
      { deep: true }
    );

    watch(
      () => props.newPoint,
      (newPoint) => {
        props.formData.latitude = newPoint.latitude;
        props.formData.longitude = newPoint.longitude;
      },
    );

    const save = () => {
      if (invalidFields.length > 0) {
        console.log('nope')
        return
      }
      else {
        emit('save', props.formData);
      }
    };

    const close = () => {
      emit('close');
    };

    return {
      save,
      close,
      invalidFields,
    };
  },
});
</script>

<style scoped lang="css">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  display: flex !important;
  flex-direction: column;
  background-color: #333;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  /* Adjust width for mobile */
  max-width: 500px;
  /* Set a maximum width */
}

.modal .input__label {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  margin-left: 2rem;
  margin-top: 0.7rem;
  display: block;
  transition: all 0.3s;
  transform: translateY(0rem);
}

.modal .input__label::first-letter {
  text-transform: capitalize;
}

.modal .error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  display: block;
}

.modal .input__field {
  font-family: 'Roboto', sans-serif;
  color: #282828;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: rgb(255, 255, 255);
  border: none;
  width: 75%;
  display: block;
  border-bottom: 0.3rem solid transparent;
  transition: all 0.3s;
}

.modal .input__field.error {
  border: 2px solid red;
}


.modal h3 {
  margin-top: 0;
}

.modal .error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  display: block;
}

.button-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 1rem;
}

.hikeDifficulty {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0rem;
  gap: 3px;
}

.hikeDifficulty .field {
  margin-left: 2rem;
  display: inline-grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.hikeDifficulty .field .input {
  cursor: pointer;
  height: 2rem;
  /* Increase size for touch */
  width: 2rem;
  /* Increase size for touch */
  background: #fff;
  position: relative;
  box-sizing: border-box;
  transition: border-color 1s ease, border-width 1s ease, transform 1s ease;
  cursor: pointer;
  margin: 5px;
  /* add spacing */
}

.hikeDifficulty .field .input:hover {
  border-color: gray !important;
  border-width: 8px;
}

hikeDifficulty .field .input:checked {
  border-color: #1976d2;
  transform: scale(1.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

hikeDifficulty .field .label {
  text-align: center;
}

.button {
  border: none;
  padding: 12px 24px;
  /* Increase button size */
  font-size: 16px;
  /* Increase font size */
}

/* Media Queries for Mobile */
@media (max-width: 768px) {
  .modal {
    padding: 1.5rem;
    /* Reduce padding on mobile */
  }

  .modal .input__label,
  .modal .input__field {
    font-size: 1rem;
    /* Reduce font size on mobile */
  }

  .modal .field-wrapper .hikeDifficulty .label {
    text-align: center;
  }

  .modal .field-wrapper .hikeDifficulty .field {
    margin-left: 1rem;
  }
}
</style>
