import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useContext() {
  const route = useRoute();
  const context = ref(route.params.context);

  watch(
    () => route.params.context,
    (value) => context.value = value
  );

  return { context };
}
