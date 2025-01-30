export const moriodata = {
  throughput: {
    topics: 'Morio Tap Service: Topic troughput',
    processors: 'Morio Tap Service: Processor troughput',
  }
}

export default {
  // This module only has 1 metricset: throughput
  throughput: ({ data, templates }) => {
    /*
     * This generates a chart that shows throughput per topic
     */
    const perTopic = JSON.parse(JSON.stringify(templates.charts.line))
    /*
     * Note that the id is the only thing that is not Echarts specific
     * Instead, we use it to differentiate between multiple charts
     * for the same metricset
     */
    perTopic.id = 'processors'
    perTopic.title.text = info.throughput.topics
    perTopic.yAxis.name = 'Events per second'
    perTopic.series = Object.keys(data[0].data.topics).map(name => ({
      ...JSON.parse(JSON.stringify(templates.series.line)),
      name,
      data: data.map(entry => Math.ceil(entry.data.topics[name]/30)),
    }))

    /*
     * This generates a chart that shows throughput per topic
     */
    const perProcessor = JSON.parse(JSON.stringify(templates.charts.line))
    /*
     * Note that the id is the only thing that is not Echarts specific
     * Instead, we use it to differentiate between multiple charts
     * for the same metricset
     */
    perTopic.id = 'topics'
    perProcessor.title.text = input.throughput.processors
    perProcessor.yAxis.name = 'Events per second'
    perProcessor.series = Object.keys(data[0].data.processors).map(name => ({
      ...JSON.parse(JSON.stringify(templates.series.line)),
      name,
      data: data.map(entry => Math.ceil(entry.data.processors[name]/30)),
    }))

    /*
     * When a metricset has multiple charts, return them as an array
     * and make sure they have an id set
     */
    return [perTopic, perProcessor]
  }
}

