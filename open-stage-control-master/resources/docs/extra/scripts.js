document.addEventListener('DOMContentLoaded', ()=>{

    if (window.location.hash && window.location.href.includes('properties-reference')) {
        // show target in tabs/details
        document.querySelectorAll('[id='+window.location.hash.split("#")[1]+']').forEach(function(item){
            var tab = item.closest('.tabbed-block'),
                container= item.closest('.tabbed-set'),
                details = item.closest('details'),
                index = 0
            while (tab.previousElementSibling) {
                index++
                tab = tab.previousElementSibling
            }
            console.log(index)
            container.querySelectorAll('.tabbed-labels label:nth-child('+(index+1)+')').forEach(function(item,i){
                item.click()
            })

            if (item) {
                item.scrollIntoView()
                document.documentElement.scrollTop -= 70
            }
        })
    }


})
