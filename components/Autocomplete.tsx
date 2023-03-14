// @ts-nocheck
"use client"
import React, { useState } from 'react'
import "../styles/Autocomplete.css"

export default function Autocomplete({ options, onChange, className = '', width = '300px', rowHeight = '40px', choosingMaxHeight = '200px', backgroundColor = null, defaultValue = null }) {

  const [visibleOptions, setVisibleOptions] = useState(options);

  const autocompleteRef = React.createRef();
  const inputRef = React.createRef();
  const menuRef = React.createRef();

  function handleKeyPress(e) {
    if (e.key === 'Enter') onChange(inputRef.current.value);
  }

  function resetVisibleOption() {
    setVisibleOptions(options);
  }

  function handleInputOnFocus(e) {
    if (e.target.value.length > 0) menuRef.current.style.display = 'flex';
  }

  function handleInputOnBlur(e) {
    if (e.relatedTarget && (e.relatedTarget.getAttribute('tabindex') == '0' || e.relatedTarget == inputRef.current)) e.preventDefault();
    else {
      inputRef.current.value = '';
      menuRef.current.style.display = 'none';
      resetVisibleOption();
    }
  }

  function resetAutoselect() { 
    inputRef.current.value = '';
    menuRef.current.style.display = 'none';
    resetVisibleOption();
  }

  function handleInputOnKeyDown(e) {
    if (e.key == 'ArrowDown' || e.key == 'ArrowUp' || e.key == 'Enter') {
      e.preventDefault();
      let availableOptions = autocompleteRef.current.querySelectorAll('*[tabindex="0"]');
      if (availableOptions.length == 0) return;
      let selectedElement = autocompleteRef.current.querySelector('*[tabindex="0"]:focus');
      let optionValue = selectedElement ? selectedElement.innerText : null;
      console.log(`optionValue: ${optionValue}`);
      if (e.key == 'ArrowDown') {
        if (!selectedElement) availableOptions[0].focus();
        if (selectedElement && selectedElement.nextSibling) {
          selectedElement.nextSibling.focus();
        }
      }
      if (e.key == 'ArrowUp') {
        if (selectedElement) {
          if(selectedElement.previousSibling) {
          selectedElement.previousSibling.focus();
          }
          else {
            inputRef.current.focus();
          }
        }
      }

      if (e.key == 'Enter') {
        if (selectedElement) {
          onChange(optionValue);
          e.target.blur();
          console.log(optionValue);
        }
      }
    }
  }

  function handleInputOnKeyUp(e) {

  }

  return (
    <div ref={autocompleteRef} className={`ir-autocomplete ${className}`} style={{ display: 'block', alignSelf: 'center', width: `${width}` }}>
      <input ref={inputRef} list='options' onFocus={handleInputOnFocus} onKeyDownCapture={handleInputOnKeyDown} onChange={(e) => { setVisibleOptions(options.filter(option => option.includes(e.target.value))); if (e.target.value.length > 0) e.target.nextSibling.style.display = 'flex'; else e.target.nextSibling.style.display = 'none'; return; onChange(e.target.value); }} onKeyDown={handleKeyPress} onBlur={handleInputOnBlur} placeholder={'Find a player'} style={{ border: '1px solid rgba(255, 255, 255, 0.23)', borderRadius: '5px', height: rowHeight, width: '100%' }} spellCheck='false'></input>
      <div ref={menuRef} style={{ position: 'absolute', display: 'none', backgroundColor: '#282828', width: 'inherit', maxHeight: choosingMaxHeight, overflow: 'auto', flexDirection: 'column' }}>
        {visibleOptions.map((option, index) => (<div key={index} onKeyDownCapture={handleInputOnKeyDown} onBlur={handleInputOnBlur} tabIndex={0} style={{ display: 'flex', alignItems: 'center', flexBasis: '45px', minHeight: '45px', flexGrow: '0', paddingLeft: '15px' }} onMouseDown={(e) => { onChange(option); resetAutoselect(); }}>{option}</div>))}
      </div>
    </div>
  )
}
