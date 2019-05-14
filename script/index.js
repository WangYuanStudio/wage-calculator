function $(id){
  return document.getElementById(id)
}
function addWorker(value1,value2){
  let parent = $('worker-list-group')
  let index = parent.childElementCount + 1
  let worker = `
    <div class="name">
        <h5 class="worker-name">岗位${index}</h5>
        <button type="button" class="btn btn-danger btn-sm del-worker" onclick="delWorker('worker-list-group-${index}')">删除</button>
        <div style="clear:both"></div>
    </div>
    <div class="input-group">
      <span class="input-group-addon">岗位工资</span>
      <input type="number" oninput="update()" class="form-control wage" placeholder="岗位工资" aria-describedby="sizing-addon2" value="${value1?value1:""}">
    </div>
    <div class="input-group">
      <span class="input-group-addon">岗位数量</span>
      <input type="number" oninput="update()" class="form-control count" placeholder="岗位数量" aria-describedby="sizing-addon2" value="${value2?value2:""}" >
    </div>
  `
  let li = document.createElement('li')
  li.className="list-group-item"
  li.id=`worker-list-group-${index}`
  li.innerHTML = worker
  parent.appendChild(li)
}
function delWorker(id){
  $(id).parentElement.removeChild($(id))
  setTimeout(() => {
    update()
  });
}
function getData(){
  let result = {
    count: 0,
    workers: [],
    ratio: 0.15
  }
  result.count = Number($("count").value)
  let workers = $("worker-list-group").children
  for(let i=0;i<workers.length;i++){
    let item = workers[i]
    result.workers.push({
      name: item.getElementsByClassName("worker-name")[0].innerHTML,
      count: Number(item.getElementsByClassName("count")[0].value),
      wage: Number(item.getElementsByClassName("wage")[0].value),
    })
  }
  result.ratio = $("ratio").value === ""?15:Number($("ratio").value)
  return result
}
function update(data){
  let WorkstationCount = 0//岗位数
  data = data?data:getData()
  localStorage.WageCalculator = JSON.stringify(data)
  let result_1 = 0 //总金额
  data.workers.forEach((item)=>{
    result_1 += item.count * item.wage
    WorkstationCount += item.count
  })

  let result_3 = 0 //网园经费
  result_3 = Number((result_1 * (data.ratio / 100)).toFixed(1))

  let result_2 = 0 //每人所得
  result_2 = Number(((result_1 - result_3)/data.count).toFixed(1))

  //计算每个岗位要上交的钱
  let result_4 = ""
  if(WorkstationCount<=data.count){
    data.workers.forEach((item)=>{
      let s = (item.wage*10 - result_2*10)/10
      result_4 += `<div>${item.name}应${s>0?'交':'获得'} [${Math.abs(s)}]</div>`
    })
  }else{
    result_4 = "岗位数大于总人数"
  }

  $("result_1").innerHTML = result_1
  $("result_2").innerHTML = result_2
  $("result_3").innerHTML = result_3 + ((result_1*100 - result_2 * data.count *100 - result_3*100)/100)//误差算进经费
  $("result_4").innerHTML = result_4
}
function init(){
  try{
    let data = JSON.parse(localStorage.WageCalculator)

    $("count").value = data.count
    $("ratio").value = data.ratio
    data.workers.forEach((item)=>{
      addWorker(item.wage,item.count)
    })
    
    update(data)
  }
  catch(e){

  }
}