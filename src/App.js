import React, { createClass, PropTypes } from 'react';
import {Motion, spring} from 'react-motion';

const RoundButton = createClass({
  getInitialState(){
    return { isOpen: false , childButtons:[]};
  },
  getDefaultProps(){
    return {...this.props,
      width: 1000,
      height: 1000,
      mainRadius: 50,
      mainBG: '#7FDBFF',
      mainColor: '#FFF',
      childRadius: 25,
      flyOutRadius: 150,
      separationAngle: 30,
      speed: 50
    };
  },
  componentDidMount(){
    console.log(this.props.children);
    this.setState({...this.state,
      childButtons: this.props.children.map((item)=>(false))
    });
  },
  toRadians(deg){
    return deg * 0.0174533;
  },
  toggleButton(){
    const {speed} = this.props;
    this.setState({...this.state,
      isOpen: !this.state.isOpen
    });
    this.state.childButtons.forEach((item, index)=>{
      setTimeout(()=>{
        this.setState({...this.state,
          childButtons: this.state.childButtons.map((child, childIndex)=>{
            if(childIndex !== index) return child;
            return !child;
          })
        });
      }, index * speed);
    });
  },
  finalDeltaPosition(index){
    const {width,height,mainRadius,mainBG,mainColor,childRadius,flyOutRadius,separationAngle,children} = this.props;
    const fanAngle = (children.length - 1) * separationAngle;
    const baseAngle = (180 - fanAngle)/2;
    const angle = baseAngle + ( index * separationAngle);
    return {
      dX: flyOutRadius * Math.cos(this.toRadians(angle)) - childRadius,
      dY: flyOutRadius * Math.sin(this.toRadians(angle)) + childRadius
    };
  },
  mainButtonStyles(){
    const {width,height,mainRadius,mainBG,mainColor,childRadius,flyOutRadius,separationAngle,children} = this.props;
    return {
      backgroundColor: mainBG,
      color: mainColor,
      width: mainRadius*2,
      height: mainRadius*2,
      position: 'absolute',
      top: height/2 - mainRadius,
      left: width/2 - mainRadius,
      WebkitClipPath: `circle(50% at 50% 50%)`,
      clipPath: `circle(50% at 50% 50%)`,
      cursor: 'pointer'
    };
  },
  initialChildButtonStyles(){
    const {width,height,mainRadius,mainBG,mainColor,childRadius,flyOutRadius,separationAngle,children} = this.props;
    return {
      width: childRadius*2,
      height: childRadius*2,
      position: 'absolute',
      top: spring(height/2 - childRadius),
      left: spring(width/2 - childRadius),
      WebkitClipPath: `circle(50% at 50% 50%)`,
      clipPath: `circle(50% at 50% 50%)`,
      cursor: 'pointer'
    };
  },
  finalChildButtonStyles(index){
    const {width,height,mainRadius,mainBG,mainColor,childRadius,flyOutRadius,separationAngle,children} = this.props;
    const {dX, dY} = this.finalDeltaPosition(index);
    return {
      width: childRadius*2,
      height: childRadius*2,
      position: 'absolute',
      top: spring(height/2 + dY),
      left: spring(width/2 + dX),
      WebkitClipPath: `circle(50% at 50% 50%)`,
      clipPath: `circle(50% at 50% 50%)`,
      cursor: 'pointer'
    };
  },
  render(){
    const {isOpen} = this.state;
    const {width,height,mainRadius,mainBG,mainColor,childRadius,flyOutRadius,separationAngle,children} = this.props;
    const fanAngle = (children.length - 1) * separationAngle;
    const baseAngle = (180 - fanAngle)/2;
    return (
      <div className="RoundButton" style={{width: width, height: height, position: 'relative', backgroundColor: '#39CCCC'}}>
        {
          children.map((item, index)=>{
            const style = this.state.childButtons[index] ? this.finalChildButtonStyles(index) : this.initialChildButtonStyles();
            const {top, left} = this.state.childButtons[index] ? this.finalChildButtonStyles(index) : this.initialChildButtonStyles();
            return (
              <Motion style={{top:top,left:left}} key={index}>
                {
                  ({top, left})=>(
                    <div key={index} className='Item' style={{...style, top: top, left: left}}>{item}</div>
                  )
                }
              </Motion>
            );
            // return <div key={index} className='Item' style={style}>{item}</div>;
          })
        }
        <div className="mainButton" onClick={this.toggleButton} style={this.mainButtonStyles()} >
          <i className={isOpen? 'fa fa-times fa-3x' : 'fa fa-plus fa-3x'} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}/>
        </div>
      </div>
    );
  }
});

export default RoundButton;
