import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useResource() {
  const route = useRoute();
  const resource = ref(route.params.resource);

  watch(
    () => route.params.resource,
    (value) => resource.value = value
  );

  return { resource };
}
