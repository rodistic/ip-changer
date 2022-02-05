const { BrowserWindow,app } = require('electron').remote 

let ipc = require('electron').ipcRenderer;

var netInterfaces 

ipc.on('load-interfaces', (event,args) => {
    
    netInterfaces = args;
    loadInterfaces()

})

function loadInterfaces(){

    var html = ""
    

    $.each(netInterfaces,function(index,value){

        html = html + "<div class='item' id='"+index+"-item' onclick='openInterface("+index+")'>"
        var ip_address = "N/A"
        var gateway = "N/A"
        var netmask = "N/A"

        for (const key in value) {

            console.log(`${key}: ${value[key]}`);

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

        console.log(html)

    })


}

$('#closeApp').click(function(){

    app.relaunch()
    app.quit()

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


    intHtml = intHtml + "<label for='ipaddr'>IP-Adresse</label><br><input type='text' id='ipaddr' placeholder='192.168.2.2'><br>"
    intHtml = intHtml + "<label for='netmask'>Netmask</label><br><input type='text' id='netmask' placeholder='255.255.255.0'><br>"
    intHtml = intHtml + "<label for='gw'>Standard Gateway</label><br><input type='text' id='netmask' placeholder='192.168.2.2'><br><br>"
    intHtml = intHtml + "<label for='dns1'>Primär DNS-Server</label><br><input type='text' id='dns1' placeholder='8.8.8.8'><br>"
    intHtml = intHtml + "<label for='dns1'>Sekundär DNS-Server</label><br><input type='text' id='dns2' placeholder='8.8.4.4'><br>"

    intHtml = intHtml + "</div>"
    $('#content').html(intHtml)

}

