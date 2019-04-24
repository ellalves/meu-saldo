const LOAD_TICKETS = (state, tickets) => {
  state.tickets = tickets
}

const LOAD_TICKET = (state, ticket) => {
  state.ticket = ticket
}

export {
  LOAD_TICKETS,
  LOAD_TICKET
}
