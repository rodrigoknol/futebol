class modal{
  constructor(element){
    this.modal = document.getElementById(element)
  }
  open(){
    this.modal.classList.remove('modal--closed')
    this.modal.showModal();
  }
  close(){
    this.modal.classList.add('modal--closed')
    this.modal.close()
  }
}