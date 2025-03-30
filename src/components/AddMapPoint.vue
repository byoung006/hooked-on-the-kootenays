<template>
  <div class="modal-overlay">
    <div class="modal-wrapper">
      <h3>Add Fishing Spot Details</h3>
      <span v-if="Object.values(invalidFields).some(Boolean)" class="error-message">Please fill all required
        fields</span>
      <div class="field-wrapper" v-for="field in Object.keys(fields)">
        <label class="input__label" v-if="
          field !== 'latitude' &&
          field !== 'longitude' &&
          field !== 'camping' &&
          field !== 'dogFriendly' &&
          field !== 'trailLength' &&
          field !== 'hikeIn' &&
          field !== 'hikeDifficultyLevel'
        " :class="{
          error: invalidFields[field]
        }">
          <p>{{ field.toString() }}:</p>
          <input class="input__field" :class="{ error: invalidFields[field] }"
            v-model="formData[field as keyof PointData]" type="text" />
        </label>
        <label class="input__label" v-else-if="field === 'camping' || field === 'hikeIn'"
          :class="{ error: invalidFields[field] }">
          <p>{{ field }}:</p>
          <select class="input__field" :class="{ error: invalidFields[field] }" v-model="formData[field]">
            <option value="">Select</option>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </label>
        <label class="input__label" v-else-if="field === 'trailLength'">
          <p>{{ field + ' (In Meters)' }}:</p>
          <input class="input__field" inputmode="numeric" min="0" :class="{ error: invalidFields[field] }"
            v-model="formData.trailLength" type="number" />
        </label>
        <label class="input__label" v-else-if="field === 'dogFriendly'" :class="{ error: invalidFields[field] }">
          <p>{{ field }}:</p>
          <select class="input__field" :class="{ error: invalidFields[field] }" v-model="formData.dogFriendly">
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
              v-model="formData.hikeDifficultyLevel" />
            <label class="label" :for="`difficulty-${level}`">{{ level }}</label>
          </div>
        </div>
        <label class="input__label" v-else-if="field === 'latitude'" :class="{ error: invalidFields[field] }">
          <p>Latitude:</p>
          <p class="input__field">{{ formData.latitude }}</p>
        </label>
        <label class="input__label" v-else-if="field === 'longitude'" :class="{ error: invalidFields[field] }">
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
import { fieldMappings, mapPointDataToFields, type PointData } from '../../server/api/utils.ts'

export default defineComponent({
  name: 'AddMapPoint',
  props: {
    fields: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    formData: {
      type: Object as PropType<PointData>,
      required: true,
    },
    newPoint: {
      type: Object as PropType<Record<string, number>>,
      required: true,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    // Initialize component state
    const invalidFields = reactive<Record<string, boolean>>({});
    props.formData.latitude = props.newPoint.latitude;
    props.formData.longitude = props.newPoint.longitude;
    // Initialize invalidFields
    Object.keys(props.fields).forEach((field: string, index) => {
      invalidFields[field] = false;
    });
    // Methods
    const validateFormData = (formData: PointData, invalidFields: Record<string, any>): Record<string, boolean> => {
      const optionalFields = ['latitude', 'longitude', 'linkToWebsite'];

      Object.keys(props.fields).forEach((key: string) => {
        const value = formData[key as keyof PointData];
        const isOptionalField = optionalFields.includes(key);

        if (!isOptionalField) {
          const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
          invalidFields[key] = isEmpty;
        }
      });

      return invalidFields;
    };
    watch(
      () => props.formData,
      (newFormData) => {
        if (newFormData) {
          if (newFormData.trailLength !== undefined) {
            const trailLengthValue = Number(newFormData.trailLength);
            if (isNaN(trailLengthValue) || trailLengthValue < 0) {
              newFormData.trailLength = 0;
            }
          }
          const validationResults = validateFormData(newFormData, invalidFields);
          for (const key in validationResults) {
            if (validationResults.hasOwnProperty(key)) {
              invalidFields[key] = validationResults[key];
            }
          }
        }
      },
      { deep: true }
    );
    watch(
      () => props.newPoint,
      (newPoint) => {
        props.formData.latitude = newPoint.latitude as number;
        props.formData.longitude = newPoint.longitude as number;
      },
    );

    const save = () => {
      const hasErrors = Object.values(invalidFields).some(Boolean);
      if (hasErrors) {
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
      validateFormData,
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

.modal-wrapper {
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

.modal-wrapper .input__label {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  margin-left: 2rem;
  margin-top: 0.7rem;
  display: block;
  transition: all 0.3s;
  transform: translateY(0rem);
}

.modal-wrapper .input__label::first-letter {
  text-transform: capitalize;
}

.modal-wrapper .error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  display: block;
}

.modal-wrapper .input__field {
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

  input[type=number] {
    -moz-appearance: textfield;
    display: none;
    /* Firefox */
  }
}

.modal .input__field {
  font-family: 'Roboto', sans-serif;
  color: #282828;
  font-size: 1.0rem;
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: rgb(255, 255, 255);
  border: none;
  width: 75%;
  display: block;
  border-bottom: 0.3rem solid transparent;
  transition: all 0.3s;

  input[type=number] {
    -moz-appearance: textfield;
    display: none;
    /* Firefox */
  }
}

.modal-wrapper .input__field.error {
  border: 2px solid red;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
    /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type=number] {
    -moz-appearance: textfield;
    /* Firefox */
  }
}


.modal-wrapper h3 {
  margin-top: 0;
}

.modal-wrapper .error-message {
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

.hikeDifficulty .field .input:checked {
  border-color: #1976d2;
  transform: scale(1.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.hikeDifficulty .field .label {
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
  .modal-wrapper {
    padding: 1.5rem;
    /* Reduce padding on mobile */
  }

  .modal-wrapper .input__label,
  .modal-wrapper .input__field {
    font-size: 1rem;
    /* Reduce font size on mobile */
  }

  .modal-wrapper .field-wrapper .hikeDifficulty .label {
    text-align: center;
  }

  .modal-wrapper .field-wrapper .hikeDifficulty .field {
    margin-left: 1rem;
  }
}

@media (max-width: 1920px) {
  .modal-wrapper {
    max-height: 90vh;
  }

  .modal-wrapper .input__label,
  .modal-wrapper .input__field {
    font-size: 0.85rem;
    /* Reduce font size on mobile */
  }
}
</style>
