import React from 'preact/compat';
import { useState, useEffect, useRef } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  const [ showDelete, setShowDelete ] = useState(false);
  const [ showMenu, setShowMenu] = useState(false)

  const [level, setLevel] = useState([])

  const [value, setValue] = useState("")

  const tagRef = useRef();

  const tagListenerFunction = (event) => {
    if(tagRef.current !== null && !tagRef.current.contains(event.target)){
      setShowMenu(false)
    }
  }


  const handleOutsideClick = () => {
    const tagItem = document.getElementById("")
     document.addEventListener("click", tagListenerFunction)
  }

  const removeListener = () =>{
    document.removeEventListener("click", tagListenerFunction)
  }

  useEffect(() => {
    handleOutsideClick()
    return () => {
      removeListener()
    }
  }, [])


  useEffect(() => {

    if(props.annotation && !(level.length > 0)){

    const tagBodies = props.annotation.bodies ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];
    

    if(tagBodies && tagBodies[0]){
      const newValue = tagBodies[0].value
      const newLevels = newValue.split(" / ")
      console.log('checking the new levels', newLevels)
      setLevel(newLevels)
    }}
  }, [props.annotation])

  // Every body with a 'tagging' purpose is considered a tag
  const tagBodies = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

    if(tagBodies && tagBodies[0]){
      const newValue = tagBodies[0].value
      setValue(newValue)
    }

  const toggle = tag => _ => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else 
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDelete = tag => evt => { 
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

  // const onSubmit = tag => {
  //   props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: tag.trim() });
  // }

  const handleSelect = (val, index) => {

    let newLevel = []

    if(index === 0){
      newLevel = [val]
    } else if (index === 1){
      newLevel = [level[0], val]
    }else if (index === 2){
      newLevel = [level[0], level[1], val]
      setShowMenu(false)
    }

    setLevel(newLevel)

    const newValue = newLevel.join(" / ")

    setValue(newValue);
    // setShowMenu(false)
    if(tagBodies && tagBodies[0]){
      props.onUpdateBody(tagBodies[0], { ...tagBodies[0], value: newValue });
      return;
    }
    props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: newValue });
  }

  const handleToggle = () => {
    setShowMenu(!showMenu)
  }


  useEffect(() => {
    if(showMenu && value){
      const scrollElement = document.getElementById(value.split(" / ")[0])
      if(scrollElement){
      scrollElement.scrollIntoView(scrollElement)}
    }
  }, [showMenu])

  const currentOption = props.vocabulary &&  props.vocabulary.find(option => option.value === value.split(" / ")[0]) 

  if(value.split(" / ")[2]){
    
  }
  const newLevels = value.split(" / ")

  const forLabels = [...newLevels]
  forLabels[0] = currentOption && currentOption.label

  if(currentOption && value.split(" / ")[1]){
    const disease =  currentOption.options && currentOption.options.find(option => option.value === value.split(" / ")[1]) 
    if(disease){
      forLabels[1] = disease.label
    }
  }

  if(value.split(" / ")[2]){
    const obersation =  props.observationOptions && props.observationOptions.find(option => option.value === value.split(" / ")[2]) 
    if(obersation){
      forLabels[2] = obersation.label
    }
  }
  const finalLabel = forLabels.join(" / ")
  

  return (
    <div className="r6o-widget tag" ref={tagRef}>
      <div class="tag-dropdown" >
        <button onClick={handleToggle} class="btn btn-sm tag-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="tag-icon">
          <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
           
           {
             currentOption && finalLabel || props.placeholder || i18n.t('Select Tag')
           }
        </button>
        <div className="tag-dropdown-block" style={{display: showMenu ? 'flex' : 'none'}}>
        <div class="tag-dropdown-menu" id="organList">
        {
            props.vocabulary && props.vocabulary.length > 0 &&
            props.vocabulary.map(option => {
              return (
              <span id={option.value} class={`dropdown-item button-span ${newLevels[0] === option.value ? "selected" : ""}`} onClick={() => handleSelect(option.value, 0)}>
                {option.label}
                <span style={{float:"right"}}>
                  >
                </span>
                </span>
              )
            })
          }
        </div>
        <div class="tag-dropdown-menu" style={{display: newLevels[0] ? 'flex' : 'none'}}>
        {
            currentOption && currentOption.options &&  currentOption.options.length > 0 &&
            currentOption.options.map(option => {
              return (
              <span class={`dropdown-item button-span ${newLevels[1] === option.value ? "selected" : ""}`} onClick={() => handleSelect(option.value, 1)}>
                {option.label}
                <span style={{float:"right"}}>
                  >
                </span>
                </span>
              )
            })
          }
        </div>
        <div class="tag-dropdown-menu" style={{display: newLevels[1] ? 'flex' : 'none'}}>
        {
            props.observationOptions &&  props.observationOptions.length > 0 &&
            props.observationOptions.map(option => {
              return (
              <span class={`dropdown-item button-span ${newLevels[2] === option.value ? "selected" : ""}`} onClick={() => handleSelect(option.value, 2)}>{option.label}</span>
              )
            })
          }
        </div>
        </div>
        
      </div>
 
    </div>
  )

};

export default TagWidget;