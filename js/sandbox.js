framework.handleSetupAll()

const textarea = document.querySelector('textarea')
const output = document.querySelector('.sandbox__output')

textarea.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
  });

const makeOutput = () =>{
    console.log(textarea.value)
    output.innerHTML = textarea.value
}

textarea.oninput = makeOutput