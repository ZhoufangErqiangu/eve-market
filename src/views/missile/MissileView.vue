<template>
  <h1>{{ $t("Missile calculator") }}</h1>
  <el-row :gutter="25">
    <el-col :span="12">
      <el-form :model="form" :rules="rules" label-width="180px">
        <el-form-item :label="$t('Missile drf')" prop="damageReductionFactor">
          <el-input-number v-model="form.damageReductionFactor" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item :label="$t('Missile damage')" prop="damage">
          <el-input-number v-model="form.damage" :min="0" :step="1" />
        </el-form-item>
        <el-form-item :label="$t('Fire interval')" prop="fireInterval">
          <el-input-number v-model="form.fireInterval" :min="0.01" :step="0.01" />
        </el-form-item>
        <el-form-item :label="$t('Explosion radius')" prop="explosionRadius">
          <el-input-number v-model="form.explosionRadius" :min="1" :step="0.01" />
        </el-form-item>
        <el-form-item :label="$t('Explosion velocity')" prop="explosionVelocity">
          <el-input-number v-model="form.explosionVelocity" :min="1" :step="1" />
        </el-form-item>
        <el-divider />
        <el-form-item :label="$t('Target signal radius')" prop="signalRadius">
          <el-input-number v-model="form.signalRadius" :min="1" :step="0.01" />
        </el-form-item>
        <el-form-item :label="$t('Target velocity')" prop="velocity">
          <el-input-number v-model="form.velocity" :min="1" :step="1" />
        </el-form-item>
        <el-divider />
        <el-form-item>
          <el-button @click="onSave">
            Save
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-table :data="result">
        <el-table-column :label="$t('Label')">
          <template #default="scope">
            {{ $t(scope.row.label) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Value')" prop="value" />
      </el-table>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ElButton, ElCol, ElDivider, ElForm, ElFormItem, ElInputNumber, ElMessage, ElRow, ElTable, ElTableColumn, type FormRules } from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/table/style/css";
import { computed, onMounted, ref } from "vue";

const form = ref<{
  // attack
  damageReductionFactor?: number;
  damage?: number;
  fireInterval?: number;
  explosionRadius?: number;
  explosionVelocity?: number;
  // target
  velocity?: number;
  signalRadius?: number;
}>({});
const rules: FormRules = {
  damageReductionFactor: [
    { required: true, message: "Please input damage reduction factor", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  damage: [
    { required: true, message: "Please input damage", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  fireInterval: [
    { required: true, message: "Please input rate of fire", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  explosionRadius: [
    { required: true, message: "Please input explosion radius", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  explosionVelocity: [
    { required: true, message: "Please input explosion velocity", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  velocity: [
    { required: true, message: "Please input velocity", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
  signalRadius: [
    { required: true, message: "Please input signal radius", trigger: "blur" },
    { type: "number", message: "Please input a number", trigger: "blur" },
  ],
};

const result = computed(() => {
  const { damageReductionFactor, damage, fireInterval, explosionRadius, explosionVelocity, velocity, signalRadius } = form.value;
  if (damageReductionFactor && damage && fireInterval && explosionRadius && explosionVelocity && velocity && signalRadius) {
    // on board
    const dpsOnBoard = damage / fireInterval;
    // real
    const magnification = Math.max(
      0,
      Math.min(
        1,
        signalRadius / explosionRadius,
        ((signalRadius * explosionVelocity) / (explosionRadius * velocity)) ** damageReductionFactor,
      ));
    const dph = damage * magnification;
    const dps = dph / fireInterval;

    return [
      { label: "DPS on board", value: dpsOnBoard.toFixed(2) },
      { label: "Magnification", value: `${(magnification * 100.0).toFixed(2)} %` },
      { label: "Damage per hit", value: dph.toFixed(2) },
      { label: "Damage per second", value: dps.toFixed(2) },
    ];
  } else {
    return [
      { label: "DPS on board", value: "N/A" },
      { label: "Magnification", value: "N/A" },
      { label: "Damage per hit", value: "N/A" },
      { label: "Damage per second", value: "N/A" },
    ];
  }
});

const STORAGE_KEY = "missile";
function onSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  ElMessage.success("Saved");
}
onMounted(() => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    form.value = JSON.parse(data);
  }
});
</script>
