import React, { useEffect } from "react";
import { B, CONFIG, RESOURCES } from "../data.js";
import { PageHead, RedWord } from "../ui.jsx";

const ML_FORM_ID = "44245461";
const ML_FORM_HTML = `<style type="text/css">@import url("https://assets.mlcdn.com/fonts.css?version=1785409");</style>
    <style type="text/css">
    /* LOADER */
    .ml-form-embedSubmitLoad {
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    .g-recaptcha {
    transform: scale(1);
    -webkit-transform: scale(1);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    height: ;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }

    .ml-form-embedSubmitLoad:after {
      content: " ";
      display: block;
      width: 11px;
      height: 11px;
      margin: 1px;
      border-radius: 50%;
      border: 4px solid #fff;
    border-color: #ffffff #ffffff #ffffff transparent;
    animation: ml-form-embedSubmitLoad 1.2s linear infinite;
    }
    @keyframes ml-form-embedSubmitLoad {
      0% {
      transform: rotate(0deg);
      }
      100% {
      transform: rotate(360deg);
      }
    }
      #mlb2-44245461.ml-form-embedContainer {
        box-sizing: border-box;
        display: table;
        margin: 0 auto;
        position: static;
        width: 100% !important;
      }
      #mlb2-44245461.ml-form-embedContainer h4,
      #mlb2-44245461.ml-form-embedContainer p,
      #mlb2-44245461.ml-form-embedContainer span,
      #mlb2-44245461.ml-form-embedContainer button {
        text-transform: none !important;
        letter-spacing: normal !important;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper {
        background-color: #FFFFFF;
        
        border-width: 0px;
        border-color: transparent;
        border-radius: 4px;
        border-style: solid;
        box-sizing: border-box;
        display: inline-block !important;
        margin: 0;
        padding: 0;
        position: relative;
              }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper.embedPopup,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper.embedDefault { width: 400px; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper.embedForm { max-width: 400px; width: 100%; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-align-left { text-align: left; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-align-center { text-align: center; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-align-default { display: table-cell !important; vertical-align: middle !important; text-align: center !important; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-align-right { text-align: right; }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedHeader img {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        height: auto;
        margin: 0 auto !important;
        max-width: 100%;
        width: undefinedpx;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody {
        padding: 20px 20px 0 20px;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody.ml-form-embedBodyHorizontal {
        padding-bottom: 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent {
        text-align: left;
        margin: 0 0 20px 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 {
        color: #131312;
        font-family: 'Work Sans', sans-serif;
        font-size: 30px;
        font-weight: 400;
        margin: 0 0 10px 0;
        text-align: left;
        word-break: break-word;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
        color: #000000;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin: 0 0 10px 0;
        text-align: left;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ul,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ul,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol {
        color: #000000;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol {
        list-style-type: lower-alpha;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol ol,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol ol {
        list-style-type: lower-roman;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p a,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p a {
        color: #000000;
        text-decoration: underline;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group {
        text-align: left!important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group label {
        margin-bottom: 5px;
        color: #333333;
        font-size: 14px;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-weight: bold; font-style: normal; text-decoration: none;;
        display: inline-block;
        line-height: 20px;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p:last-child,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p:last-child {
        margin: 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody form {
        margin: 0;
        width: 100%;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow {
        margin: 0 0 20px 0;
        width: 100%;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow {
        float: left;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent.horozintalForm {
        margin: 0;
        padding: 0 0 20px 0;
        width: 100%;
        height: auto;
        float: left;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow {
        margin: 0 0 10px 0;
        width: 100%;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-last-item {
        margin: 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-formfieldHorizintal {
        margin: 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        height: auto;
        line-height: 21px !important;
        margin-bottom: 0;
        margin-top: 0;
        margin-left: 0;
        margin-right: 0;
        padding: 10px 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input::-webkit-input-placeholder,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow input::-webkit-input-placeholder { color: #333333; }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input::-moz-placeholder,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow input::-moz-placeholder { color: #333333; }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input:-ms-input-placeholder,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow input:-ms-input-placeholder { color: #333333; }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input:-moz-placeholder,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow input:-moz-placeholder { color: #333333; }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow textarea, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow textarea {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        height: auto;
        line-height: 21px !important;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::before {
          border-color: #cccccc!important;
          background-color: #ffffff!important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input.custom-control-input[type="checkbox"]{
        box-sizing: border-box;
        padding: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
        margin-top: 5px;
        margin-left: -1.5rem;
        overflow: visible;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::before {
        border-radius: 4px!important;
      }


      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow input[type=checkbox]:checked~.label-description::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox input[type=checkbox]:checked~.label-description::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-input:checked~.custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-input:checked~.custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox input[type=checkbox]:checked~.label-description::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input:checked~.custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input:checked~.custom-control-label::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input:checked~.custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-input:checked~.custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-input:checked~.custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-input:checked~.custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox input[type=checkbox]:checked~.label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox input[type=checkbox]:checked~.label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow input[type=checkbox]:checked~.label-description::before  {
          border-color: #000000!important;
          background-color: #000000!important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::after {
           top: 2px;
           box-sizing: border-box;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::after {
           top: 0px!important;
           box-sizing: border-box!important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::after {
        top: 0px!important;
           box-sizing: border-box!important;
      }

       #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::after {
            top: 0px!important;
            box-sizing: border-box!important;
            position: absolute;
            left: -1.5rem;
            display: block;
            width: 1rem;
            height: 1rem;
            content: "";
       }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before {
        top: 0px!important;
        box-sizing: border-box!important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .custom-control-label::before {
          position: absolute;
          top: 4px;
          left: -1.5rem;
          display: block;
          width: 16px;
          height: 16px;
          pointer-events: none;
          content: "";
          background-color: #ffffff;
          border: #adb5bd solid 1px;
          border-radius: 50%;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .custom-control-label::after {
          position: absolute;
          top: 2px!important;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::before {
          position: absolute;
          top: 4px;
          left: -1.5rem;
          display: block;
          width: 16px;
          height: 16px;
          pointer-events: none;
          content: "";
          background-color: #ffffff;
          border: #adb5bd solid 1px;
          border-radius: 50%;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::after {
          position: absolute;
          top: 0px!important;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::after {
          position: absolute;
          top: 0px!important;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .custom-radio .custom-control-label::after {
          background: no-repeat 50%/50% 50%;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .custom-checkbox .custom-control-label::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::after, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description::after {
          background: no-repeat 50%/50% 50%;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-control, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-control {
        position: relative;
        display: block;
        min-height: 1.5rem;
        padding-left: 1.5rem;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-input, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-input, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-input {
          position: absolute;
          z-index: -1;
          opacity: 0;
          box-sizing: border-box;
          padding: 0;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label {
          color: #000000;
          font-size: 12px!important;
          font-family: 'Open Sans', Arial, Helvetica, sans-serif;
          line-height: 22px;
          margin-bottom: 0;
          position: relative;
          vertical-align: top;
          font-style: normal;
          font-weight: 700;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow .custom-select, #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow .custom-select {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        line-height: 20px !important;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 28px 10px 12px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
        height: auto;
        display: inline-block;
        vertical-align: middle;
        background: url('https://assets.mlcdn.com/ml/images/default/dropdown.svg') no-repeat right .75rem center/8px 10px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }


      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow {
        height: auto;
        width: 100%;
        float: left;
      }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal { width: 70%; float: left; }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-button-horizontal { width: 30%; float: left; }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-button-horizontal.labelsOn { padding-top: 25px;  }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .horizontal-fields { box-sizing: border-box; float: left; padding-right: 10px;  }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow input {
        background-color: #ffffff;
        color: #333333;
        border-color: #cccccc;
        border-radius: 4px;
        border-style: solid;
        border-width: 1px;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 10px;
        width: 100%;
        box-sizing: border-box;
        overflow-y: initial;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow button {
        background-color: #CC0000 !important;
        border-color: #CC0000;
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        box-shadow: none;
        color: #ffffff !important;
        cursor: pointer;
        font-family: 'Work Sans', sans-serif;
        font-size: 14px !important;
        font-weight: 700;
        line-height: 20px;
        margin: 0 !important;
        padding: 10px !important;
        width: 100%;
        height: auto;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow button:hover {
        background-color: #131312 !important;
        border-color: #131312 !important;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow input[type="checkbox"] {
        box-sizing: border-box;
        padding: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
        margin-top: 5px;
        margin-left: -1.5rem;
        overflow: visible;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description {
        color: #000000;
        display: block;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 12px;
        text-align: left;
        margin-bottom: 0;
        position: relative;
        vertical-align: top;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label {
        font-weight: normal;
        margin: 0;
        padding: 0;
        position: relative;
        display: block;
        min-height: 24px;
        padding-left: 24px;

      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label a {
        color: #000000;
        text-decoration: underline;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label p {
        color: #000000 !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
        font-size: 12px !important;
        font-weight: normal !important;
        line-height: 18px !important;
        padding: 0 !important;
        margin: 0 5px 0 0 !important;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label p:last-child {
        margin: 0;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit {
        margin: 0 0 20px 0;
        float: left;
        width: 100%;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button {
        background-color: #CC0000 !important;
        border: none !important;
        border-radius: 4px !important;
        box-shadow: none !important;
        color: #ffffff !important;
        cursor: pointer;
        font-family: 'Work Sans', sans-serif !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        line-height: 21px !important;
        height: auto;
        padding: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button.loading {
        display: none;
      }
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button:hover {
        background-color: #131312 !important;
      }
      .ml-subscribe-close {
        width: 30px;
        height: 30px;
        background: url('https://assets.mlcdn.com/ml/images/default/modal_close.png') no-repeat;
        background-size: 30px;
        cursor: pointer;
        margin-top: -10px;
        margin-right: -10px;
        position: absolute;
        top: 0;
        right: 0;
      }
      .ml-error input, .ml-error textarea, .ml-error select {
        border-color: red!important;
      }

      .ml-error .custom-checkbox-radio-list {
        border: 1px solid red !important;
        border-radius: 4px;
        padding: 10px;
      }

      .ml-error .label-description,
      .ml-error .label-description p,
      .ml-error .label-description p a,
      .ml-error label:first-child {
        color: #ff0000 !important;
      }

      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow.ml-error .label-description p,
      #mlb2-44245461.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow.ml-error .label-description p:first-letter {
        color: #ff0000 !important;
      }
            @media only screen and (max-width: 400px){

        .ml-form-embedWrapper.embedDefault, .ml-form-embedWrapper.embedPopup { width: 100%!important; }
        .ml-form-formContent.horozintalForm { float: left!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow { height: auto!important; width: 100%!important; float: left!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal { width: 100%!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal > div { padding-right: 0px!important; padding-bottom: 10px; }
        .ml-form-formContent.horozintalForm .ml-button-horizontal { width: 100%!important; }
        .ml-form-formContent.horozintalForm .ml-button-horizontal.labelsOn { padding-top: 0px!important; }

      }
    </style>
    <div id="mlb2-44245461" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-44245461">
      <div class="ml-form-align-center ">
        <div class="ml-form-embedWrapper embedForm">

          
          

          <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">

            <div class="ml-form-embedContent" style=" ">
              
                <h4>Stay Sharp on Canadian Investing</h4>
                <p>Free tips and product updates. No Spam, Unsubscribe anytime.</p>
              
            </div>

            <form class="ml-block-form" action="https://assets.mailerlite.com/jsonp/2540563/forms/194281571163833632/subscribe" data-code="" method="post" target="_blank">
              <div class="ml-form-formContent">
                

                  
                  <div class="ml-form-fieldRow ml-last-item">
                    <div class="ml-field-group ml-field-email ml-validate-email ml-validate-required">

                      


                      <!-- input -->
                      <input aria-label="email" aria-required="true" type="email" class="form-control" data-inputmask="" name="fields[email]" placeholder="Email" autocomplete="email">
                      <!-- /input -->

                      <!-- textarea -->
                      
                      <!-- /textarea -->

                      <!-- select -->
                      
                      <!-- /select -->

                      <!-- checkboxes -->
            
            <!-- /checkboxes -->

                      <!-- radio -->
                      
                      <!-- /radio -->

                      <!-- countries -->
                      
                      <!-- /countries -->





                    </div>
                  </div>
                
              </div>

              

              <!-- Privacy policy -->
              
              <!-- /Privacy policy -->

              

              

              






              
              <input type="hidden" name="ml-submit" value="1">

              <div class="ml-form-embedSubmit">
                
                  <button type="submit" class="primary">Subscribe</button>
                
                <button disabled="disabled" style="display: none;" type="button" class="loading">
                  <div class="ml-form-embedSubmitLoad"></div>
                  <span class="sr-only">Loading...</span>
                </button>
              </div>

              
              <input type="hidden" name="anticsrf" value="true">
            </form>
          </div>

          <div class="ml-form-successBody row-success" style="display: none">

            <div class="ml-form-successContent">
              
                <h4>Thank you!</h4>
                
                  <p>You have successfully joined our subscriber list.</p>
                
              
            </div>

          </div>
        </div>
      </div>
    </div>
`;

function NewsletterBox() {
  useEffect(() => {
    // Success message swap — required by MailerLite's embed markup
    window.ml_webform_success_44245461 = function () {
      var $ = window.ml_jQuery || window.jQuery;
      if ($) {
        $(".ml-subscribe-form-" + ML_FORM_ID + " .row-success").show();
        $(".ml-subscribe-form-" + ML_FORM_ID + " .row-form").hide();
      }
    };

    // Load MailerLite's form-handling script once, after this component (and its
    // .ml-embedded markup) already exists in the DOM — avoids the SPA race condition
    // where the global script scans for forms before React has mounted them.
    if (!document.getElementById("ml-webforms-script")) {
      const script = document.createElement("script");
      script.id = "ml-webforms-script";
      script.src = "https://groot.mailerlite.com/js/w/webforms.min.js?v83147fa8ce2d95cb73ece7f28b469519";
      script.async = true;
      document.body.appendChild(script);
    }

    // MailerLite's own view-tracking beacon
    fetch("https://assets.mailerlite.com/jsonp/2540563/forms/194281571163833632/takel").catch(() => {});
  }, []);

  return (
    <div style={{
      background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
      borderRadius: 18, padding: "clamp(24px, 4vw, 36px)", textAlign: "center", marginTop: 34,
    }}>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: B.white, margin: "0 0 8px" }}>
        Join the <RedWord>MapleSheet</RedWord> newsletter
      </h3>
      <p style={{ color: B.grayLight, fontSize: 14, margin: "0 0 18px", lineHeight: 1.6 }}>
        New trackers, free tools, and Canadian investing guides — straight to your inbox. No spam, unsubscribe anytime.
      </p>
      <div style={{ maxWidth: 460, margin: "0 auto" }} dangerouslySetInnerHTML={{ __html: ML_FORM_HTML }} />
    </div>
  );
}

export default function Resources() {
  const posts = RESOURCES.filter((r) => r.live !== false);
  const comingSoon = RESOURCES.filter((r) => r.type === "video" && r.live === false);
  return (
    <div className="ml-fade">
      <PageHead kicker="LEARN" title={<>Resources for <RedWord>Canadian investors</RedWord></>}
        sub="Guides, video walkthroughs, and product news. Because understanding your money comes before tracking it." />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "30px 24px 0" }}>
        {posts.map((r) => (
          <article key={r.title} style={{
            background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
            padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
          }}>
            <div style={{ fontSize: 12, color: B.gray, marginBottom: 8 }}>
              {r.type === "video" ? "🎬 Video" : "📝 Article"} · {r.date}
            </div>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: B.white, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{r.title}</h2>
            {r.image && (
              <img src={r.image} alt={r.title} style={{
                width: "100%", borderRadius: 12, marginBottom: 16, display: "block",
                border: `1px solid ${B.line}`, aspectRatio: "1200 / 630", objectFit: "cover",
              }} />
            )}
            {r.type === "video" && r.youtubeId && (
              <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", marginBottom: 14, border: `1px solid ${B.line}` }}>
                <iframe src={`https://www.youtube-nocookie.com/embed/${r.youtubeId}`} title={r.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            )}
            {(() => {
              const raw = r.body || r.summary;
              const blocks = Array.isArray(raw) ? raw : [raw];
              return blocks.map((block, i) =>
                block.startsWith("## ") ? (
                  <h3 key={i} style={{ fontSize: 16.5, fontWeight: 700, color: B.white, margin: i === 0 ? "0 0 10px" : "22px 0 10px" }}>
                    {block.slice(3)}
                  </h3>
                ) : (
                  <p key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 14px" }}>
                    {block}
                  </p>
                )
              );
            })()}
          </article>
        ))}
        {comingSoon.length > 0 && (
          <div style={{
            border: `1px dashed ${B.line}`, borderRadius: 16, padding: "20px 24px",
            color: B.gray, fontSize: 14, textAlign: "center",
          }}>
            🎬 {comingSoon[0].summary} Subscribe on{" "}
            <a href={CONFIG.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: B.red, fontWeight: 600 }}>YouTube</a>{" "}
            to catch it first.
          </div>
        )}
        <NewsletterBox />
      </div>
    </div>
  );
}
