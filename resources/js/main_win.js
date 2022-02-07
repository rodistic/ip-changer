const { BrowserWindow,app } = require('electron').remote 

let ipc = require('electron').ipcRenderer;

var netInterfaces 
var profiles
var currentInterface

$('#manage-profiles').click(function(){

    ipc.send('manage-profiles','')

})


ipc.on('load-interfaces', (event,args) => {
    
    netInterfaces = args;
    loadInterfaces()

})

ipc.on('load-profiles', (event,args) => {
    
    profiles = args

})

function loadInterfaces(){

    var html = ""
    

    $.each(netInterfaces,function(index,value){

        html = html + "<div class='item' id='"+index+"-item' onclick='openInterface("+index+")'>"
        var ip_address = "N/A"
        var gateway = "N/A"
        var netmask = "N/A"

        for (const key in value) {


            if(`${key}` == "name"){
                html = html + "<p class='item-name'>"+`${value[key]}`+"</p>"
            }

            if(`${key}` == "model"){
                html = html + "<p class='item-model'>"+`${value[key]}`+"</p>"
            }

            if(`${key}` == "ip_address"){
                ip_address = `${value[key]}`
            }

            if(`${key}` == "netmask"){
                netmask = `${value[key]}`
            }

            if(`${key}` == "gateway_ip"){
                gateway = `${value[key]}`
            }

            if(`${key}` == "type"){
                if(`${value[key]}` == "Wired"){
                    html = html + "<i class='item-type fa fa-network-wired'></i>"
                } else {
                    html = html + "<i class='item-type fa fa-wifi'></i>"
                }
                
            }


        }

        html = html + "<p class='item-ip'>IP-Adresse: "+ip_address+"</p>"
        html = html + "<p class='item-ip'>Netmask: "+netmask+"</p>"
        html = html + "<p class='item-gw'>Gateway: "+gateway+"</p>"
        

        html = html + "</div>"

        $('#content').html(html)

    })


}

$('#closeApp').click(function(){

    ipc.send('minimize-tray','pong')

})

    
$('#minApp').click(function(){
    var window = BrowserWindow.getFocusedWindow();
    window.minimize();
})


function openInterface(id){

    var intHtml = "<div class='interface'>"
    intHtml = intHtml + "<i onclick='loadInterfaces()' class='interface-back fa fa-arrow-left'></i>"

    var name
    var model
    var ip_address
    var netmask
    var gateway

    $.each(netInterfaces,function(index,value){
        if(index == id){

            for (const key in value) {

                if(`${key}` == "name"){
                    name = `${value[key]}`
                    currentInterface =`${value[key]}`
                }
    
                if(`${key}` == "model"){
                    model = `${value[key]}`
                }
    
                if(`${key}` == "ip_address"){
                    ip_address = `${value[key]}`
                }
    
                if(`${key}` == "netmask"){
                    netmask = `${value[key]}`
                }
    
                if(`${key}` == "gateway_ip"){
                    gateway = `${value[key]}`
                }
    
    
            }

        }
    })

    intHtml = intHtml + "<p class='interface-name'><b>"+name+"</b></p>"
    intHtml = intHtml + "<p class='interface-model'>"+model+"</p>"

    //intHtml = intHtml + "<label>Manuell Konfigurieren</label><input id='checkbox' onclick='confirmCheck()' type='checkbox'>"

    intHtml = intHtml + "<div id='profile-sel'><label>Profil-Auswählen:</label>"
    intHtml = intHtml + "<select id='profile'>"
    intHtml = intHtml + "<option value='dhcp'>DHCP</option>"

    $.each(profiles,function(index,value){

        intHtml = intHtml + "<option value='"+index+"'>"+value.name+"</option>"

    })

    intHtml = intHtml + "</select><br><br><button class='btn btn-sm btn-info' style='margin:auto' onclick='saveP()'>Anwenden</button> </div><div style='display:none' id='manual'> "

    intHtml = intHtml + "<label for='ipaddr'>IP-Adresse</label><br><input type='text' id='interface-ipaddr' placeholder='192.168.2.2'><br>"
    intHtml = intHtml + "<label for='netmask'>Netmask</label><br><input type='text' id='interface-netmask' placeholder='255.255.255.0'><br>"
    intHtml = intHtml + "<label for='gw'>Standard Gateway</label><br><input type='text' id='interface-gw' placeholder='192.168.2.2'><br><br>"
    intHtml = intHtml + "<label for='dns1'>Primär DNS-Server</label><br><input type='text' id='interface-dns1' placeholder='8.8.8.8'><br>"
    intHtml = intHtml + "<label for='dns1'>Sekundär DNS-Server</label><br><input type='text' id='interface-dns2' placeholder='8.8.4.4'><br><br><button onclick='saveM()' class='btn btn-sm btn-info' style='margin:auto'>Anwenden</button></div>"

    intHtml = intHtml + "</div>"
    $('#content').html(intHtml)

}

function confirmCheck() {
  if ($('#checkbox').is(':checked')) {
    $('#profile-sel').hide()
    $('#manual').show()
  } else {
    $('#profile-sel').show()
    $('#manual').hide()
  }
}

function saveM(){

    $('#content').html('<div class="loader"><div class="dots-bars-5"></div><p style="text-align:center;font-size:12px">Netzwerkschnittstelle wird Konfiguriert...</p></div>')

    var ip = $('#interface-ipaddr').val()
    var netmask = $('#interface-netmask').val()
    var gateway = $('#interface-gw').val()
    var dns1 = $('#interface-dns1').val()
    var dns2 = $('#interface-dns2').val()
    var interface = currentInterface

    var value = {"ip": ip,"netmask": netmask,"gateway": gateway,"dns1": dns1,"dns2": dns2,"interface": interface}
    

    ipc.send('update-ip-address',value)
    


}

function saveP(){
    var selProfile = $('#profile').val()

    $('#content').html('<div class="loader"><div class="dots-bars-5"></div><p style="text-align:center;font-size:12px">Netzwerkschnittstelle wird Konfiguriert...</p></div>')

    if(selProfile == "dhcp"){

        var dhcp = {"name":"dhcp","interface":currentInterface}

        ipc.send('update-ip-address',dhcp)

    } else {

        $.each(profiles, function(index,value){

            if(index == selProfile){
    
                value.interface = currentInterface
    
                ipc.send('update-ip-address',value)
    
            }
    
        })

    }

}