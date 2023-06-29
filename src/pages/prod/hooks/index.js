import { toRefs, reactive } from "vue";
import { getProductInfo } from "../../../api/index";

export const useGetProductDetail = () => {
  const state = reactive({
    data: {},
    loading: true,
  });

  getProductInfo()
    .then((res) => {
      state.data = res.data;
    })
    .finally(() => {
      state.loading = false;
    });

  return {
    ...toRefs(state),
  };
};
