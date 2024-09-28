import React from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";

var dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#660000',
                '#FBB117',
                '#6AA121',
                '#00008b',
                '#00ffff'
            ],
        }
    ],
    labels: []
};

var myChart = null;

function ChartJs() {
    renderChart();
    return (
        <>
        </>
    );
}

function ChartCreation() {
    
    if (myChart != null)
    {
        myChart.destroy();
        
    }
    var ctx = document.getElementById("myChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: dataSource
    });
}

function renderChart() {
    axios.get('http://localhost:3005/budget')
        .then(function (res) {
            for (var i = 0; i < res.data.myBudget.length; i++) {
                dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
                dataSource.labels[i] = res.data.myBudget[i].title;
            }
            ChartCreation();
        });
}

export default ChartJs;