export const moriodata = {
  throughput: {
    topics: 'Troughput per topic',
    processors: 'Troughput per stream processor',
  }
}

export default {
  // This module only has 1 metricset: throughput
  throughput: ({ data, templates }) => {
    /*
     * This generates a chart that shows throughput per topic
     */
    const perTopic = templates.charts.line
    /*
     * Note that the id is the only thing that is not Echarts specific
     * Instead, we use it to differentiate between multiple charts
     * for the same metricset
     */
    perTopic.id = 'processors'
    perTopic.title.text = 'Throughput per topic'
    perTopic.yAxis.name = 'Events per second'
    perTopic.series = Object.keys(data[0].data.topics).map(name => ({
      ...templates.series.line,
      name,
      /*
       * We are rounding up here because 0.4 messages per second is
       * more useful when rounded to 1, rather than to 0.
       */
      data: data.map(entry => Math.ceil(entry.data.topics[name]/30)),
    }))

    /*
     * This generates a chart that shows throughput per topic
     */
    const perProcessor = templates.charts.line
    /*
     * Note that the id is the only thing that is not Echarts specific
     * Instead, we use it to differentiate between multiple charts
     * for the same metricset
     */
    perTopic.id = 'topics'
    perProcessor.title.text = 'Throughput per stream processor'
    perTopic.yAxis.name = 'Events per second'
    perProcessor.series = Object.keys(data[0].data.processors).map(name => ({
      ...templates.series.line,
      name,
      /*
       * We are rounding up here because 0.4 messages per second is
       * more useful when rounded to 1, rather than to 0.
       */
      data: data.map(entry => Math.ceil(entry.data.processors[name]/30)),
    }))

    /*
     * When a metricset has multiple charts, return them as an array
     * and make sure they have an id set
     */
    return [perTopic, perProcessor]
  }
}

