let arrayCopy=[];



function getFullRepos(userInput,perPage,page) {
  let nextPage=parseInt(page+1);
  $.get({
    url:`https://api.github.com/users/${userInput}/repos?per_page=${perPage}&page=${page}`
  }).done(function(data){
    if(data.length!=0){
      let length=data.length;
      if (length==perPage) {
        for (let index = 0; index < length; index++) {
          arrayCopy.push(data[index]);          
        }
        getFullRepos(userInput,perPage,nextPage);
      } else {
        let remainingRepo=length-data.length;
        for (let index = 0; index < remainingRepo; index++) {
          arrayCopy.push(data[index]);          
        }
        arangingRepo(nextPage,perPage);
      }
    }else{
        arangingRepo(nextPage-1,perPage);
    }
  }).fail(function(){
    alert(`The User name ${userInput} is not found`);
  });
}




// function getRepos(userInput) {
//   $.get({
//     url:`https://api.github.com/users/${userInput}/repos`
//   }).done(function(data){
//     $("#content").addClass("content");
//     arangingRepo(data.length,data);
//   }).fail(function(){
//     alert(`${userInput} User name not found`);
//   });
// }

function getUserInfo(userInput) {
  $.get({
    url:`https://api.github.com/users/${userInput}`
  }).done(function(data){
    
    renderuserInfo(data);
    getFullRepos(userInput,10,1);
  }).fail(function(){
    alert(`${userInput} User name not found`);
  });
}

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

function arangingRepo(count,array) {
  $("#footer").find("#pageCount").empty();
  var noOfPages=count;
  if (noOfPages>1) {
    
    for (let index = 0; index < noOfPages-1; index++) {
      if (index==0) {
        $("#pageCount").append(`<p class="highlight" data-page-data="${index+1}">${index+1}</p>`);
      }else{
        $("#pageCount").append(`<p data-page-data="${index+1}">${index+1}</p>`);
      }
    }
  } else {
    $("#pageCount").append(`<p class="highlight" data-page-data=${1}>1</p>`);
  }
  changeContent(1,array);
}

function changeContent(array,perPage) {
  
  let name,topic;
  // if (typeof(array)==='object') {
  //   arrayCopy=array;
  //   for (let index = 0; index < 10; index++) {
  //     name = array[index].name;
  //     topic=array[index].topics;

  //     let listHtml=`
  //       <fieldset>
  //         <h3>${parseInt(index+1)}</h3>
  //         <h1>${name}</h1>
  //         ${topic.map(topicItem => `<h4>${topicItem}</h4>`).join('')}
  //       </fieldset>`
  //       $("#repoInfo").append(listHtml);
  //   }
          
  // }
  if (typeof(array)==='number') {
    $("#content").find('fieldset').remove();
    var finalArray=arrayCopy;
    var limit=finalArray.length;
    var toDisplay=parseInt(array)*perPage
    if (toDisplay>limit) {
      var toDisplay=limit%perPage;
      var indexOfArray=limit-toDisplay;

      for (let i = indexOfArray; i < limit; i++) {

        name = finalArray[i].name;
        topic=finalArray[i].topics;
        let listHtml=`
          <fieldset>
            <h3>${parseInt(i+1)}</h3>
            <h1>${name}</h1>
            ${topic.map(topicItem => `<h4>${topicItem}</h4>`).join('')}
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
            ${topic.map(topicItem => `<h4>${topicItem}</h4>`).join('')}
          </fieldset>`
          $("#repoInfo").append(listHtml);
      }
    }
    
  }
  }


$(function(){
  $("#searchButton").click(function(){
    
  var userInput=$("#userNameInput").val();
    if (userInput!="") {
      $("#content").find('fieldset').remove();
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

  

});


// $(function(){
    
//     $("#searchButton").click(function(){
      
//       var userInput=$("#userNameInput").val();
//         console.log(userInput)
//         if (userInput!="") {
//           getRepos(userInput);
//           getUserProfile(userInput);
            
//         }else {
//             $("#userNameInput").prop("placeholder", "search cannot be empty")
//         }
//     });
// });

// function getRepos(userInput) {
//   let reposData;
//   return $.get({
//     url: 'https://api.github.com/users/'+userInput+'/repos',
//     dataType: 'json',
//   })
//   .done(function (data) {
//     // Success callback
//     reposData = data;
//     console.log('reposData');
//     console.log(reposData);
//     let name,language;
//     $("#content").find('fieldset').remove();
//     $.each(reposData,function(index,repo){
//       name=repo.name;
//       language=repo.language;
//       let listHtml=`
//       <fieldset>
//         <em>${parseInt(index+1)}</em>
//         <h1>${name}</h1>
//         <h4>${language}</h4>
//       </fieldset>`
//       $("#content").append(listHtml);
//     });
//   })
//   .fail(function () {
//     // Error callback
//     alert("No User in the name "+userInput+" is found");
//     // You can add further error handling here if needed
//   });
// }

// function getUserProfile(userInput){
//   let userData;
//   $.get({
//     url:`https://api.github.com/users/${userInput}`,
//     dataType: "json"
//   }).done(function(data){
//     $("#userInfo").empty();

//     userData=data;
//     let userPic=userData.avatar_url;
//     let userName=userData.login;
//     let userBio=userData.bio;
//     let userLocation=userData.location;
//     let userTwitterId=userData.twitter_username;
//     let userGitId=`https://github.com/${userName}`

//     let infoHtml=`
//     <section class="profileBox">
//     <div class="imageBox">
//       <img class="profilePic" src='${userPic}/>'
//     </div>
//     <div class="userInfoBox">
//       <h2>${userName}</h2>
//       <h4>${userBio}</h4>
//       <h4>${userLocation}</h4>
//       <h4>${userTwitterId}</h4>
//     </div>
//     <div class="gitIdBox">
//     <h5>${userGitId}</h4>
//     </div>
//     </section>
//     `

//     $("#userInfo").html(infoHtml);
//   }).fail(function(e){
//     console.log(e);
//   })
// }

// function imgReturn(src){
//   $("#userImage").attr("src",src);
//   console.log(src);
// }










