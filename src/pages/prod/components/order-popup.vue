<template>
  <van-popup
    :show="visible"
    round
    position="bottom"
    :style="{ height: '240px' }"
    @update:show="(value) => $emit('update:visible', value)"
  >
    <div class="order-info">
      <div class="order-info-title">
        <span class="order-info-title-tip">立即下单</span>
        <span class="order-info-title-price price">单价{{ price }}/件</span>
      </div>
      <div class="order-spec-container">
        <div class="order-spec-list">
          <div class="order-spec-labels">
            <div class="spec-item spec-item-label">颜色/尺码</div>
            <div
              v-for="color in colors"
              :key="color.id"
              class="spec-item spec-item-label"
            >
              {{ color.label }}
            </div>
          </div>
          <div class="order-spec-contents">
            <div class="order-spec-row">
              <div
                class="spec-item spec-item-size"
                v-for="size in sizes"
                :key="size.id"
              >
                {{ size.label }}
              </div>
            </div>
            <div
              class="spec-item order-spec-row"
              v-for="color in colors"
              :key="color.id"
            >
              <div
                class="spec-item spec-item-size"
                v-for="size in sizes"
                :key="size.id"
              >
                <van-field
                  v-if="specMap[color.id]?.[size.id]"
                  type="digit"
                  :formatter="formatter"
                  v-on:focus="() => focus(color.id, size.id)"
                  v-on:blur="() => blur(color.id, size.id)"
                  v-model="specMap[`${color.id}`][`${size.id}`].value"
                  :placeholder="
                    String(specMap[`${color.id}`][`${size.id}`].default || '-')
                  "
                />
                <span v-else>-</span>
              </div>
            </div>
          </div>
          <div class="order-spec-totals">
            <div class="spec-item spec-item-label">小计</div>
            <div
              class="spec-item spec-item-label"
              v-for="color in colors"
              :key="color.id"
            >
              {{ statInfo.colorTotal[color.id] }}
            </div>
          </div>
        </div>
      </div>

      <div class="order-info-footer">
        <div class="total-amount">合计：{{ statInfo.totalNumber }}件</div>
        <div class="footer-right-extra">
          <span class="extra-total-amount"
            >总价：<span class="price">{{ statInfo.totalAmount }}</span></span
          >
          <van-button
            class="extra-order-button"
            plain
            type="primary"
            size="small"
            :disabled="statInfo.totalNumber === 0"
            v-on:click="submit"
            >立即下单</van-button
          >
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script >
import { reactive, computed, defineEmits } from "vue";
import { showNotify } from "vant";

import "vant/lib/index.css";

export default {
  props: ["visible", "price", "sizes", "colors"],
  emits: ["update:visible"],
  setup(props, ctx) {
    let cacheValue = "";
    let status = "";

    const specMap = reactive(
      props.colors.reduce((acc, color) => {
        color.sizes.forEach((size) => {
          if (!acc[color.id]) {
            acc[color.id] = {
              label: color.label,
            };
          }

          acc[color.id][size.id] = {
            value: "",
            default: size.number,
            label: size.label,
          };
        });

        return acc;
      }, {})
    );

    const statInfo = computed(() => {
      const colorTotal =
        Object.entries(specMap)?.reduce?.((acc, [key, value]) => {
          acc[key] = Object.values(value)?.reduce?.((acc, item) => {
            return +acc + +(item.value || 0);
          }, 0);

          return acc;
        }, {}) ?? 0;

      const totalNumber = Object.values(colorTotal)?.reduce?.((acc, v) => {
        return +acc + v;
      }, 0);

      return {
        colorTotal,
        totalNumber,
        totalAmount: totalNumber * +props.price, // 未考虑小数， 可以考虑引入三方库
      };
    });

    const formatter = (v) => (isNaN(Number(v)) ? "" : v);

    const focus = (colorId, sizeId) => {
      cacheValue = specMap[colorId][sizeId].value;
    };

    const blur = (colorId, sizeId) => {
      if (specMap[colorId][sizeId].value > specMap[colorId][sizeId].default) {
        status = "error";
        showNotify({
          type: "warning",
          message: `${specMap[colorId].label} ${specMap[colorId][sizeId].label} 超出库存`,
          "z-index": 2005,
        });
        if (cacheValue !== "") {
          specMap[colorId][sizeId].value = cacheValue;
        } else {
          specMap[colorId][sizeId].value = specMap[colorId][sizeId].default;
        }
        // vant 源码使用了 nextTick ，这里就使用 setTimeout
        // 调整 status = "" 的执行顺序
        setTimeout(() => {
          status = "";
        });
      }

      cacheValue = "";
    };

    function submit() {
      if (status === "error") return;

      ctx.emit("update:visible", false);
      showNotify({
        type: "success",
        message: "下单成功",
      });
    }

    return {
      specMap,
      statInfo,
      focus,
      blur,
      formatter,
      submit,
    };
  },
};
</script>

<style lang="less" scoped>
.price {
  color: #ff0036;
}

.order-info {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  height: 100%;
  color: rgba(0, 0, 0, 0.6);

  &-title {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
  }

  .order-spec {
    &-container {
      display: flex;
      flex: 1;
      overflow: auto;
    }

    &-list {
      display: flex;
    }

    &-item {
      display: flex;
    }

    &-labels {
      width: 80px;
      text-align: center;
    }

    &-totals {
      width: 40px;
      text-align: center;
    }

    &-contents {
      display: flex;
      flex: 1;
      flex-direction: column;
      flex-wrap: wrap;
      overflow: auto;
    }

    &-row {
      display: flex;
      width: 100%;
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  .spec-item {
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &-size {
      width: 33.33%;
      text-align: center;
      flex-shrink: 0;
    }
  }

  .van-cell {
    padding: 0;
  }

  .extra-total-amount {
    margin-right: 6px;
  }

  .footer-right-extra {
    display: flex;
    align-items: center;
  }

  :deep(.van-field__control) {
    margin: 0 10px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);

    &::placeholder {
      text-align: center;
    }
  }
}
</style> 