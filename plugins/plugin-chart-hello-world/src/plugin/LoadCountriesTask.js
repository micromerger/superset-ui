import legendItems from './entities/LegendItems';
// import { features } from "../data/countries.json";
//    this.setState(features);

class LoadCountryTask {
  setState = null;

  load = (setState, queryData, dataField, features) => {
    this.setState = setState;
    this.#processCovidData(queryData, dataField, features);
  };

  #processCovidData = (queryData, dataField, features) => {
    for (let i = 0; i < features.length; i++) {
      const area = features[i];
      //console.log(country);
      const covidCountry = queryData.find(
        queryItem => area.properties.CODE === queryItem[dataField],
      );

      country.properties[dataField] = 0;
      country.properties.subtitle = 0;

      if (covidCountry != null) {
        let confirmed = Number(covidCountry[dataField]);
        country.properties[dataField] = confirmed;
        country.properties.subtitle = dataField;
      }
      this.#setCountryColor(country);
    }

    this.setState(features);
  };

  #setCountryColor = country => {
    const legendItem = legendItems.find(item =>
      item.isFor(country.properties.confirmed),
    );

    if (legendItem != null) country.properties.color = legendItem.color;
  };
}

export default LoadCountryTask;
