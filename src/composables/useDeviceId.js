import { ref } from 'vue'

export function useDeviceId() {
  const deviceId = ref(localStorage.getItem('app_device_uuid'))

  const initDeviceId = () => {
    if (!deviceId.value) {
      // Generate a cryptographically secure random UUID
      const newId = crypto.randomUUID()
      localStorage.setItem('app_device_uuid', newId)
      deviceId.value = newId
    }
    return deviceId.value
  }

  return {
    deviceId,
    initDeviceId,
  }
}
