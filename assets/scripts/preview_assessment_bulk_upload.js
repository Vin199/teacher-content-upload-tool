// const topicObj = JSON.parse(window.localStorage.getItem("topicObj"));

// let count = 0;
// let setDiv = () => {
//   count++;
//   html = `<div class="question_forms" id="question_form_"${count}>
//   <div class="question_area">
//     <span class="question_num">Q.${count}</span>
//     <input type="text" name="question" class="question" placeholder="Type Your Question Here">
//     <input id="quesImgFile" type="file" class="quesImage" name="questionImage">
//   </div>
//   <div class="option_area">
//     <div class="opt_a">
//       <span class="question_num">A.</span>
//       <input type="text" name="opt_A" class="option" placeholder="Type Option A Here (Right Answer)">
//       <input id="optAFile" type="file" class="optImage" name="option_A_Image">
//     </div>
//     <div class=" opt_b">
//       <span class="question_num">B.</span>
//       <input type="text" name="opt_B" class="option" placeholder="Type Option B Here">
//       <input id="optBFile" type="file" class="optImage" name="option_B_Image">
//     </div>
//     <div class="opt_c">
//       <span class="question_num">C.</span>
//       <input type="text" name="opt_C" class="option" placeholder="Type Option C Here">
//       <input id="optCFile" type="file" class="optImage" name="option_C_Image">
//     </div>
//     <div class="opt_d">
//       <span class="question_num">D.</span>
//       <input type="text" name="opt_D" class="option" placeholder="Type Option D Here">
//       <input id="optDFile" type="file" class="optImage" name="option_D_Image">
//     </div>
//   </div>
// </div> `;

//   document.getElementById("set_questions").innerHTML += html;
// };

// for (const property in topicObj) {
//   for (const key in topicObj[property]) {
//     if (Object.hasOwnProperty.call(topicObj[property], key)) {
//       let element = topicObj[property][key];
//       setDiv();
//     }
//   }
// }

// const inp = document.getElementsByClassName("question_forms");
// const arr = Array.from(inp);
// const l = arr.length;
