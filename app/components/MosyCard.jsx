let modals = {}; // Hold all modal registrations by ID

export function closeMosyCard(id = "smartmodaldefaultId") {
  const modal = modals[id];
  if (modal && modal.close) {
    modal.close();
  }
}

export function MosyCard(title, body, dismissOnOutsideClick = true, id = "smartmodaldefaultId", modalClass = "") {
  const modal = modals[id];
  if (modal && modal.show) {
    modal.show({ title, body, dismissOnOutsideClick, modalClass });
  }
}


// Register modal instance under a specific ID
export function registerModal(showFn, closeFn, id = "smartmodaldefaultId") {
  modals[id] = {
    show: showFn,
    close: closeFn,
  };
}
