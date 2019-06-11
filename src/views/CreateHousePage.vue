<template>
    <PageLayout>
        <section class="py-4 bg-teal-dark">
        <div class="container">
            <form class="form">
            <div class="form__field relative">
                <i class="input-icon material-icons absolute text-grey-darker">search</i>
                <input
                class="input__search"
                id="where"
                type="text"
                placeholder="Mexico City, Mexico">
            </div>
            </form>
        </div>
        </section>
        <div class="container">
            <section class="section__create py-6">
                <h1 class="text-3x1">Publish a new room</h1>
                <form action="">
                    <div class="mb-4">
                        <label class="input__label" for="">Title</label>
                        <input 
                        v-model="publication.title"
                        class="input__field" 
                        type="text" 
                        placeholder="Bruce Wayne"
                        >
                    </div>
                    <div class="mb-4">
                        <label class="input__label" for="">Title</label>
                        <textarea
                        v-model="publication.description"
                        class="input__field" 
                        rows="10" type="text" 
                        placeholder="Bruce Wayne"
                        ></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="input__label" for="">Featured Image</label>
                        <input 
                        v-model="publication.featuredImage"
                        class="input__field" 
                        type="text" 
                        placeholder="Bruce Wayne"
                        >
                    </div>
                    <div class="mb-4 text-right">
                        <button 
                        @click="save"
                        class="w-full bg-yellow-dark text-yellow-darker font-semibold py-3 px-6 rounded"
                        ></button>
                    </div>
                </form>
            </section>
        </div>
    </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'

export default {
    components: {
        PageLayout
    },
    name: 'CreateHousePage',
    data: () => ({
        publication: {
            title: '',
            description: '',
            featuredImage: '',
        }
    }),
    methods: {
        save() {
            const {title, description, featuredImage} = this.publication
            const room = {
                title,
                description,
                featured_image: featuredImage,
                publishedAt: Date.now()
            }
            
            this.$store.dispatch('CREATE_ROOM', room).then(() => {
                this.$router.push({name: 'SearchPage'})
            });
        }
    }
}
</script>

<style>

</style>