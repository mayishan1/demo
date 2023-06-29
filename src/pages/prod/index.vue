<template>
  <div class="prod-view">
    <div class="banner-container">
      <van-skeleton :loading="loading">
        <van-swipe class="banner-swipe" :autoplay="3000">
          <van-swipe-item v-for="item in data?.banner ?? []" :key="item">
            <img class="banner-image" :src="item" />
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="banner-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>
        <div class="banner-tags" v-if="data.tags && !!data.tags.length">
          <span class="banner-tag" v-for="item in data.tags" :key="item">{{
            item
          }}</span>
        </div>
        <template #template>
          <van-skeleton-image
            :style="{
              position: 'absolute',
              left: '5%',
              top: '5%',
              width: '90%',
              height: '90%',
            }"
          />
        </template>
      </van-skeleton>
    </div>

    <van-skeleton :loading="loading" :row="3">
      <div class="base-info-container">
        <h3 class="product-name">{{ data.name }}</h3>
        <div class="product-price-container">
          <span class="product-price-label">¥</span>
          <span class="product-price-value">{{ data.price }}</span>
        </div>
        <div class="product-item-no-brand">
          <div class="product-item-no-container">
            <span class="product-item-no-label">货号：</span>
            <span class="product-item-no-value">{{ data.itemNo }}</span>
          </div>
          <span class="product-item-no-brand-split">|</span>
          <div class="product-brand-container">
            <span class="product-brand-label">品牌：</span>
            <span class="product-brand-value">{{ data.brand }}</span>
          </div>
        </div>
      </div>
      <div class="more-info-container">
        <div class="more-info-title">商品信息</div>
        <div class="product-info-list">
          <div class="product-info-row">
            <span class="product-info-label">颜色</span>
            <span class="product-info-value">
              <span v-for="(color, idx) in data.colors" :key="color.id">
                {{ color.label
                }}{{ idx === data.colors.length - 1 ? "" : "," }}</span
              >
            </span>
          </div>
          <div class="product-info-row">
            <span class="product-info-label">尺码</span>
            <span class="product-info-value">
              <span v-for="(size, idx) in data.sizes" :key="size.id">
                {{ size.label }}{{ idx === data.sizes.length - 1 ? "" : "," }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </van-skeleton>

    <OrderPopup
      v-if="data.colors && data.sizes"
      :price="data.price"
      :colors="data.colors"
      :sizes="data.sizes"
      v-model:visible="specVisible"
    />
    <div class="buy-container">
      <van-button type="primary" block @click="showSpecPopup"
        >立即购买</van-button
      >
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import OrderPopup from "./components/order-popup.vue";
import { useGetProductDetail } from "./hooks/index";

export default {
  components: {
    OrderPopup,
  },

  setup() {
    const { run, loading, data } = useGetProductDetail();

    const specVisible = ref(false);
    const showSpecPopup = () => {
      specVisible.value = true;
    };

    return {
      data,
      loading,
      specVisible,
      showSpecPopup,
    };
  },
};
</script>

<style lang="less" scoped>
.prod-view {
  padding-bottom: 40px;
}

.banner {
  &-container {
    position: relative;
    padding-top: 100%;
    margin-bottom: 12px;
  }

  &-swipe {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  &-tags {
    position: absolute;
    left: 5px;
    bottom: 5px;
    line-height: 22px;
    font-size: 12px;
  }

  &-tag {
    display: inline-block;
    padding: 0 10px;
    border-radius: 11px;
    background: rgba(0, 0, 0, 0.6);
    margin-right: 4px;
  }

  &-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    line-height: 22px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 11px;
    background: rgba(0, 0, 0, 0.6);
  }

  &-image {
    width: 100%;
  }
}

.base-info-container {
  padding-bottom: 20px;
  line-height: 28px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: 12px solid rgba(0, 0, 0, 0.06);
}

.product {
  &-price {
    &-container {
      text-align: center;
      color: #ff0036;
    }

    &-label {
      font-size: 12px;
      margin-right: 2px;
      margin-bottom: -6px;
    }

    &-value {
      font-size: 24px;
    }
  }

  &-item-no-brand {
    display: flex;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;

    &-split {
      margin: 0 4px;
    }
  }
}

.more-info {
  &-container {
    padding: 20px 0;
  }

  &-title {
    width: 120px;
    padding: 3px 0;
    margin: 0 auto;
    font-size: 14px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.product-info {
  &-list {
    padding: 20px 0;
  }

  &-row {
    padding: 12px 24px;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }

  &-label {
    display: inline-block;
    width: 60px;
    color: rgba(0, 0, 0, 0.6);
  }

  &-value {
    color: rgba(0, 0, 0, 0.9);
  }
}

.buy-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 68px;
  padding: 12px 20px;
}
</style> 