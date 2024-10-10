var gridList = document.querySelectorAll('.game-preview'); 
var gridArray = [...gridList];
var description = document.getElementById('global-game-description');

gridArray.forEach(div => {
    const curImage = div.style.backgroundImage;
    const curDescription = description.innerText;
   
    let metadata = div.querySelector('.game-metadata')
    let metaTitle = metadata.querySelector('.game-title')
    let metaDescription = metadata.querySelector('.game-description')
    
    div.addEventListener('mouseover', function() {
        div.style.backgroundImage = "url()";
        description.innerHTML = `<div class="text-2xl font-bold">${metaTitle.innerText}</div>` + "<br>" + metaDescription.innerText;
    });

    div.addEventListener('mouseout', function() {
        div.style.backgroundImage = curImage;
        description.innerHTML = curDescription
    });
});
