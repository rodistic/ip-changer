const { BrowserWindow,app } = require('electron').remote 

let ipc = require('electron').ipcRenderer;
var profiles = ""

$('#closeApp').click(function(){
    var window = BrowserWindow.getFocusedWindow();
    window.close();
})

    
$('#minApp').click(function(){
    var window = BrowserWindow.getFocusedWindow();
    window.minimize();
})

$('#new-profile').click(function(){

    $('#profile-content').load('./resources/html/form_profile.html')

})



function loadProfile(mainIndex){

    var profileHtml = ""

    $.each(profiles,function(index,value){

        if(index == mainIndex){

            profileHtml = "<br><h4 class='sp-name'><b>"+value.name+"</b></h4><input hidden id='sp-index' value='"+index+"'><label>IP-Adresse</label><input type='text' class='form-input' id='sp-ip' value='"+value.ip+"'><label>Netzmaske</label><input type='text' id='sp-netmask' class='form-input' value='"+value.netmask+"'><label>Gateway</label><input type='text' id='sp-gw' class='form-input' value='"+value.gateway+"'><label>Primär DNS-Server</label><input type='text' class='form-input' id='sp-dns1' value='"+value.dns1+"'><label>Sekundar DNS</label><input type='text' class='form-input' id='sp-dns2' value='"+value.dns2+"'><br><br><button class='btn btn-info' onclick='spSave()'>Speichern</button><button class='btn btn-danger' onclick='spDelete()'>Löschen</button>" 

        }

    })

    $('#profile-content').html(profileHtml)

}

function spDelete(){
    console.log('Delete profiles')

    var index = $('#sp-index').val()
    profiles.splice(index,1)

    ipc.send('update-profiles',profiles)

}

function spSave(){
    
    console.log('Hello')

    var ip = $('#sp-ip').val()
    var netmask = $('#sp-netmask').val()
    var gw = $('#sp-gw').val()
    var dns1 = $('#sp-dns1').val()
    var dns2 = $('#sp-dns2').val()
    var index = $('#sp-index').val()

    profiles[index].ip = ip
    profiles[index].netmask = netmask
    profiles[index].gateway = gw
    profiles[index].dns1  = dns1
    profiles[index].dns2 = dns2

    ipc.send('update-profiles',profiles)

}

ipc.on('load-profile', (event,args) => {
    
    profiles = args;
    var list_html = ""

    $.each(profiles,function(index,value){

        for (const key in value) {

            if(`${key}` == "name"){
                list_html = list_html + "<div class='list-item' onclick='loadProfile("+index+")'><p>"+`${value[key]}`+"</p></div>"
            }
                

        }

    })


    $('#list-content').html(list_html)

})