/*
The flow of the app is as follows:
  1. (document).ready function.
  2. getUserInfo()
  3. renderuserInfo() && getFullRepos()
  4. arrangingRepo()
  5. changeContnt()
*/




//creating a copy of the json array
let arrayCopy=[];

//to get all repos and store it in local array
function getFullRepos(userInput,perPage,page) {
  $("#loader").show();
  let nextPage=parseInt(page+1);
  $.get({
    url:`https://api.github.com/users/${userInput}/repos?per_page=${perPage}&page=${page}`,
    headers:{
      Authorization:`Bearer`+"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"
    }
  }).done(function(data){
    $("#loader").hide();
    if(data.length!=0){
      
      let length=data.length;
      if (length==perPage) {
        for (let index = 0; index < length; index++) {
          arrayCopy.push(data[index]);          
        }
        getFullRepos(userInput,perPage,nextPage);
        
      } else {
        let remainingRepo=data.length;
        for (let index = 0; index < remainingRepo; index++) {
          arrayCopy.push(data[index]);          
        }
        arangingRepo(nextPage,perPage);
        
      }
    }else{
        arangingRepo(nextPage-1,perPage);
    }
  }).fail(function(){
    $("#loader").hide();
    alert(`The User name ${userInput} is not found`);
  });
}
//to get the user details
function getUserInfo(userInput) {
  $.get({
    url:`https://api.github.com/users/${userInput}`,
    headers:{
      Authorization:`Bearer`+"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"
    }
    }).done(function(data){
    $("#content").addClass("content")
    renderuserInfo(data);
    getFullRepos(userInput,10,1);
  }).fail(function(response) {
    if (response.status === 403 && response.responseJSON && response.responseJSON.message.includes("rate limit exceeded")) {

        console.log("API Rate limit exceeded. Waiting before retrying...");
    } else {
        console.error("Error:", response);
        alert(`Error: ${response.statusText}`);
    }
});

}
//to render the retrieved user details in the browser
function renderuserInfo(userJson) {
  $("#userInfo").empty();

    var userData=userJson;
    let userPic=userData.avatar_url;
    let userName=userData.login;
    let userBio=(userData.bio==null)?"":userData.bio;
    let userLocation=(userData.location==null)?"":userData.location;
    var userTwitterId=(userData.twitter_username==null)?"Twitter not Linked":userData.twitter_username;
    let userGitId=`https://github.com/${userName}`

    let infoHtml=`
    <section class="profileBox">
      <div class="imageBox">
        <img class="profilePic" src='${userPic}'/>
      </div>
      <div class="userInfoBox">
        <h2>${userName}</h2>
        <h4>${userBio}</h4>
        <h4>${userLocation}</h4>
        <h4>${userTwitterId}</h4>
      </div>
      <div class="gitIdBox">
        <h5>${userGitId}</h4>
      </div>
    </section>
    `

    $("#userInfo").html(infoHtml);

}
//to determine the no. of pages required as per the user's choice
function arangingRepo(count,array) {
  $("#footer").find("#pageCount").empty();
  var noOfPages=count;
  if (noOfPages>1) {
    $("#pageCount").append(`<button>Previous</button>`);
    for (let index = 0; index < noOfPages-1; index++) {
      if (index==0) {
        $("#pageCount").append(`<p class="highlight" data-page-data="${index+1}">${index+1}</p>`);
      }else{
        $("#pageCount").append(`<p data-page-data="${index+1}">${index+1}</p>`);
      }
    }
    $("#pageCount").append(`<button>Next</button>`);
  } else {
    $("#pageCount").append(`<p class="highlight" data-page-data=${1}>1</p>`);
  }
  changeContent(1,array);
}
//to display the selected set of repos
function changeContent(array,perPage) {
  
  let name,topic;
  
    $("#content").find('fieldset').remove();
    var finalArray=arrayCopy;
    var limit=finalArray.length;
    var toDisplay=parseInt(array)*perPage

    if (toDisplay>limit) {
      var toDisplay=limit%perPage;
      var indexOfArray=limit-toDisplay;
      console.log(indexOfArray,toDisplay,limit);
      for (let i = indexOfArray; i < limit; i++) {

        name = finalArray[i].name;
        topic=finalArray[i].topics;
        let listHtml=`
          <fieldset>
            <h3>${parseInt(i+1)}</h3>
            <h1>${name}</h1>
            <div>
            ${topic.map(topicItem => `<h4 class="topic">${topicItem}</h4>`).join('')}
            </div>
            </fieldset>`
          $("#repoInfo").append(listHtml);  
      }
      
    } else {
      for (let index = toDisplay-perPage; index < toDisplay; index++) {
        name = finalArray[index].name;
        topic=finalArray[index].topics;
        let listHtml=`
          <fieldset>
            <h3>${parseInt(index+1)}</h3>
            <h1>${name}</h1>
            ${topic.map(topicItem => `<h4 class="topic">${topicItem}</h4>`).join('')}
          </fieldset>`
          $("#repoInfo").append(listHtml);
      }
    }
    
  
  }

//function initiation
$(function(){
  $("#searchButton").click(function(){
    $("#loader").show();
    $("#loader2").show();
  var userInput=$("#userNameInput").val();
    if (userInput!="") {
      $("#content").find('fieldset').remove();
      $("#pageCount").find("p").remove();
      
      getUserInfo(userInput);
    } else {
      alert("Please enter the user name");
    }
  });
  $("#pageCount").on("click", "p", function(){
    var clickedPage = $(this).text();
    
    // Get the corresponding data attribute value
    var pageData = $(this).data("page-data");
    // Check if the data attribute exists
    if (pageData) {
        changeContent(pageData,10);
        $("p").removeClass("highlight");
        $(this).addClass("highlight")
        // Perform actions based on the page data
    } else {
        alert(`Page ${clickedPage} clicked`);
        // Perform default actions if no data is associated
    }
});

  $("#pageCount").on("click","button",function(){
    var clicked=$(this).text();

    if (clicked==='Previous') {
      var selected=$("[class='highlight']");
      var selectedPage=parseInt(selected.text());
      if (selectedPage==1) {
        null;
      } else {
        $("#pageCount p").removeClass("highlight");
        $(`p:contains(${String(selectedPage-1)})`).addClass("highlight");
        changeContent(selectedPage-1,10);
      }
      // (selectedPage==1)?null:changeContent(selectedPage-1,10);
    } else {
      var selected=$("[class='highlight']");
      var selectedPage=parseInt(selected.text());
      if (selectedPage==parseInt($("#pageCount > p:last").text())) {
        null;
      } else {
        $("#pageCount p").removeClass("highlight");
        $(`p:contains(${String(selectedPage+1)})`).addClass("highlight");
        changeContent(selectedPage+1,10);
      }
      // (selectedPage==parseInt($("#pageCount > p:last").text()))?null:changeContent(selectedPage+1,10);
    }
  });

  

});


