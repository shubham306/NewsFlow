import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 15,
    category: "genral",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }
  async updateNews(){
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=${
        this.props.category
      }&apiKey=${this.props.apiKey}&page=${
        this.state.page
      }&pageSize=${this.props.pageSize}`;
      this.props.setProgress(30);
      let data = await fetch(url);
      let parsedData = await data.json();
      this.props.setProgress(60);
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
      });
      this.props.setProgress(100);
  }
  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async()=>{
    this.setState({page: this.state.page+1})
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=${
        this.props.category
      }&apiKey=${this.props.apiKey}&page=${
        this.state.page
      }&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
      });
  }

  render() {
    return (
      <>
        <h1 className="text-center" >News Headlines</h1>
        <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                > 
                <div className="container">
        <div className="row my-3">
          {this.state.articles.map((element) => {
            return (
              <div className="col md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  desc={element.description ? element.description : ""}
                  imgln={element.urlToImage}
                  urln={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
        </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
