const data = JSON.parse(window.localStorage.getItem("historyData"));
let count = 0;
for (const key in data) {
  if (Object.hasOwnProperty.call(data, key)) {
    const element = data[key];
    count++;
    if (element != null) {
      let html = `<div class="question_forms" id="question_form_${count}">
                      <div class="question_area">
                        <span class="question_num">Q.${count}</span>
                        <input type="text" name="question" class="question" placeholder="Type Your Question Here" value="${
                          element.q
                        }" disabled>
                        <img src="${
                          element.questionImage
                        }" alt="img" width="50" height="50">
                      </div>
                      <div class="option_area">
                        <div class="opt_a">
                          <span class="question_num">A.</span>
                          <input type="text" name="opt_A" class="option" placeholder="Type Option A Here (Right Answer)" value="${
                            element.A.type == "image" ? "" : element.A.value
                          }" disabled>
                          <img src="${
                            element.A.type == "text" ? "" : element.A.value
                          }" width="50" height="50">
                        </div>
                        <div class=" opt_b">
                          <span class="question_num">B.</span>
                          <input type="text" name="opt_B" class="option" placeholder="Type Option B Here" value="${
                            element.B.type == "image" ? "" : element.B.value
                          }" disabled>
                          <img src="${
                            element.B.type == "text" ? "" : element.B.value
                          }" width="50" height="50">
                        </div>
                        <div class="opt_c">
                          <span class="question_num">C.</span>
                          <input type="text" name="opt_C" class="option" placeholder="Type Option C Here" value="${
                            element.C.type == "image" ? "" : element.C.value
                          }" disabled>
                          <img src="${
                            element.C.type == "text" ? "" : element.C.value
                          }" width="50" height="50">
                        </div>
                        <div class="opt_d">
                          <span class="question_num">D.</span>
                          <input type="text" name="opt_D" class="option" placeholder="Type Option D Here" value="${
                            element.D.type == "image" ? "" : element.D.value
                          }" disabled>
                          <img src="${
                            element.D.type == "text" ? "" : element.D.value
                          }" width="50" height="50">
                        </div>
                      </div>
                    </div> `;

      document.getElementById("set_questions").innerHTML += html;
    }
  }
}
