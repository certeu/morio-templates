/**
 * A method to determine metricset and metrics for the morio-tap module
 *
 * @param {object} data - The full message from RedPanda
 * @param {object} tools - The tools object
 * @return {array} result - A [metricset(string), metrics(object)] array
 */
export default function morioTapMetrics (data={}, tools) {
  if (data.metricset?.name === 'throughput' && data.morio?.tap?.throughput) {
    return ['throughput', data.morio.tap.throughput]
  }

  /*
   * Anything else we do not cache
   */
  return [false, false]
}

export const info = {
  docs: `This stream processor plugin will process metrics data from the morio-tap module.`,
  settings: {
    test: {
      dflt: 666,
      title: 'Just some number',
      about: 'This is a test for module-based settings in stream processors',
      type: 'number'
    }
  }
}

