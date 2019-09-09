const updateTotal = total => {
  document.querySelector('.total').innerHTML = total
}

const socket = new WebSocket(`ws://${window.location.hostname}:9999`)

socket.addEventListener('message', function(event) {
  try {
    const data = JSON.parse(event.data)
    if (data.type === 'update_count') {
      updateTotal(data.total)
    }
  } catch (error) {
    console.error(error)
  }
})
