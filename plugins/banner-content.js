export default ({ app }, inject) => {
    let bannerContent = '';

    inject('setBannerContent', (content) => {
        bannerContent = content;
    });

    inject('getBannerContent', () => bannerContent);
};